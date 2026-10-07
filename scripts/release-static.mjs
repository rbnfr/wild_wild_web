import { readFile, writeFile, mkdir, appendFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const contextPath = new URL(
  "../releases/release-context.json",
  import.meta.url,
);
function git(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });
  if (result.status !== 0)
    throw new Error(result.stderr || result.stdout || `Git failed: ${args[0]}`);
  return result.stdout.trim();
}
function checkSource() {
  if (git(["branch", "--show-current"]) !== "static-version")
    throw new Error("Run from static-version.");
  git(["diff", "--quiet", "HEAD", "--"]);
  if (git(["ls-files", "--others", "--exclude-standard"]))
    throw new Error("Commit source changes first.");
}
function fetch() {
  git([
    "fetch",
    "--no-tags",
    "origin",
    ...["main", "static-version", "hostinger-static"].map(
      (name) => `refs/heads/${name}:refs/remotes/origin/${name}`,
    ),
  ]);
}
async function output(skipped, version = "") {
  if (process.env.GITHUB_OUTPUT)
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `skipped=${skipped}\nversion=${version}\n`,
    );
}
function parts(version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version))
    throw new Error(`Expected a stable semantic version: ${version}`);
  const values = version.split(".").map(Number);
  if (values.some((value) => !Number.isSafeInteger(value)))
    throw new Error("Version exceeds safe integer range.");
  return values;
}
function nextVersion(a, b) {
  const av = parts(a),
    bv = parts(b);
  const comparison = av[0] - bv[0] || av[1] - bv[1] || av[2] - bv[2];
  const values = comparison >= 0 ? av : bv;
  values[2] += 1;
  if (!Number.isSafeInteger(values[2]))
    throw new Error("Patch version overflow.");
  return values.join(".");
}
function readRemoteRelease() {
  const exists = spawnSync(
    "git",
    ["cat-file", "-e", "origin/main:version.json"],
    { cwd: root },
  );
  return exists.status === 0
    ? JSON.parse(git(["show", "origin/main:version.json"]))
    : undefined;
}
async function prepare() {
  checkSource();
  fetch();
  const triggerCommit = git(["rev-parse", "HEAD"]);
  const previous = readRemoteRelease();
  if (
    previous?.triggerCommit === triggerCommit ||
    previous?.sourceCommit === triggerCommit ||
    triggerCommit !== git(["rev-parse", "origin/static-version"])
  ) {
    console.log("Already published or superseded source; no release needed.");
    await output(true);
    return;
  }
  const packagePath = new URL("../package.json", import.meta.url);
  const lockPath = new URL("../package-lock.json", import.meta.url);
  const pkg = JSON.parse(await readFile(packagePath, "utf8"));
  const lock = JSON.parse(await readFile(lockPath, "utf8"));
  const version = nextVersion(pkg.version, previous?.version || pkg.version);
  const tag = `v${version}`;
  if (git(["ls-remote", "--tags", "origin", `refs/tags/${tag}`]))
    throw new Error(`Release tag already exists: ${tag}`);
  const context = {
    version,
    triggerCommit,
    previousMain: git(["rev-parse", "origin/main"]),
    previousHosting: git(["rev-parse", "origin/hostinger-static"]),
  };
  pkg.version = version;
  lock.version = version;
  lock.packages[""].version = version;
  await writeFile(packagePath, JSON.stringify(pkg, null, 2) + "\n");
  await writeFile(lockPath, JSON.stringify(lock, null, 2) + "\n");
  git(["add", "--", "package.json", "package-lock.json"]);
  git(["commit", "-m", `chore: release ${tag} [skip ci]`]);
  context.sourceCommit = git(["rev-parse", "HEAD"]);
  await mkdir(new URL("../releases", import.meta.url), { recursive: true });
  await writeFile(contextPath, JSON.stringify(context, null, 2) + "\n");
  await output(false, version);
  console.log(`Prepared ${tag}; no remote changed.`);
}
async function context() {
  checkSource();
  const data = JSON.parse(await readFile(contextPath, "utf8"));
  parts(data.version);
  if (git(["rev-parse", "HEAD"]) !== data.sourceCommit)
    throw new Error("Release context does not match the source checkout.");
  return data;
}
function ensureRemoteUnchanged(data) {
  fetch();
  for (const [branch, expected] of [
    ["static-version", data.triggerCommit],
    ["main", data.previousMain],
    ["hostinger-static", data.previousHosting],
  ])
    if (git(["rev-parse", `origin/${branch}`]) !== expected)
      throw new Error(
        `${branch} changed during verification; retry with the latest source.`,
      );
}
async function assemble() {
  const data = await context();
  ensureRemoteUnchanged(data);
  // Only release metadata is added after the browser tests; the HTML remains identical.
  await writeFile(
    new URL("../out/version.json", import.meta.url),
    JSON.stringify(
      {
        version: data.version,
        sourceCommit: data.sourceCommit,
        triggerCommit: data.triggerCommit,
      },
      null,
      2,
    ) + "\n",
  );
  const generated = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("./prepare-git-deploy.mjs", import.meta.url))],
    { cwd: root, stdio: "inherit" },
  );
  if (generated.status !== 0)
    throw new Error("Deployment branch generation failed.");
  data.hostingCommit = git(["rev-parse", "hostinger-static"]);
  git([
    "merge-base",
    "--is-ancestor",
    data.previousHosting,
    data.hostingCommit,
  ]);
  // A real two-parent merge, without changing the source checkout or its index.
  const tree = git([
    "merge-tree",
    "--write-tree",
    data.previousMain,
    data.hostingCommit,
  ]).split("\n")[0];
  const differences = git([
    "diff-tree",
    "--no-commit-id",
    "--name-only",
    "-r",
    data.hostingCommit,
    tree,
  ])
    .split("\n")
    .filter(Boolean);
  if (
    differences.some(
      (name) =>
        ![
          ".gitignore",
          ".gitattributes",
          ".github/workflows/static.yml",
        ].includes(name),
    )
  )
    throw new Error(
      "The main merge would alter published files or include source/private files.",
    );
  data.mainCommit = git(
    ["commit-tree", tree, "-p", data.previousMain, "-p", data.hostingCommit],
    {
      input: `Merge hostinger-static: release v${data.version}\n\nSource-Commit: ${data.sourceCommit}\n`,
    },
  );
  if (
    git(["worktree", "list", "--porcelain"])
      .split("\n")
      .includes("branch refs/heads/main")
  )
    throw new Error(
      "main is checked out in a worktree; assemble on the CI runner.",
    );
  git(["update-ref", "refs/heads/main", data.mainCommit]);
  git(["tag", `v${data.version}`, data.mainCommit]);
  await writeFile(contextPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Assembled v${data.version}; no remote changed.`);
}
async function publish() {
  if (process.env.GITHUB_ACTIONS !== "true")
    throw new Error("Automatic publication is restricted to GitHub Actions.");
  const data = await context();
  ensureRemoteUnchanged(data);
  for (const [ref, expected] of [
    ["hostinger-static", data.hostingCommit],
    ["main", data.mainCommit],
    [`refs/tags/v${data.version}`, data.mainCommit],
  ])
    if (!expected || git(["rev-parse", ref]) !== expected)
      throw new Error(`Unexpected release ref: ${ref}`);
  git([
    "push",
    "--atomic",
    "origin",
    "refs/heads/static-version:refs/heads/static-version",
    "refs/heads/hostinger-static:refs/heads/hostinger-static",
    "refs/heads/main:refs/heads/main",
    `refs/tags/v${data.version}:refs/tags/v${data.version}`,
  ]);
  console.log(
    `Published v${data.version} atomically to static-version, hostinger-static and main.`,
  );
}
const commands = { prepare, assemble, publish };
const command = commands[process.argv[2]];
if (!command)
  throw new Error(
    "Usage: node scripts/release-static.mjs prepare|assemble|publish",
  );
await command();
