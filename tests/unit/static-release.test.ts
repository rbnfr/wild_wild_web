import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const fixtures: string[] = [];
function git(root: string, ...args: string[]) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout.trim();
}
function release(root: string, command: string) {
  return spawnSync(process.execPath, ["scripts/release-static.mjs", command], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, GITHUB_ACTIONS: "true", GITHUB_OUTPUT: "" },
  });
}
async function fixture() {
  const base = await mkdtemp(join(tmpdir(), "mary-release-test-"));
  fixtures.push(base);
  const root = join(base, "source"),
    remote = join(base, "remote.git");
  await mkdir(root);
  await mkdir(join(root, "scripts"));
  for (const name of ["release-static.mjs", "prepare-git-deploy.mjs"])
    await writeFile(
      join(root, "scripts", name),
      await readFile(`scripts/${name}`),
    );
  await writeFile(join(root, ".gitignore"), "out/\nreleases/\n");
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({ version: "1.0.0" }, null, 2) + "\n",
  );
  await writeFile(
    join(root, "package-lock.json"),
    JSON.stringify(
      { version: "1.0.0", packages: { "": { version: "1.0.0" } } },
      null,
      2,
    ) + "\n",
  );
  git(root, "init", "-b", "static-version");
  git(root, "config", "user.name", "Release Test");
  git(root, "config", "user.email", "release-test@example.invalid");
  git(root, "add", ".");
  git(root, "commit", "-m", "Source fixture");
  for (const name of [
    "index.html",
    ".htaccess",
    "404.html",
    "privacidad/index.html",
    "aviso-legal/index.html",
    "cookies/index.html",
    "robots.txt",
    "sitemap.xml",
  ]) {
    const path = join(root, "out", name);
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(
      path,
      name === "index.html" ? "<html>Mary</html>" : "fixture",
    );
  }
  const generated = spawnSync(
    process.execPath,
    ["scripts/prepare-git-deploy.mjs"],
    { cwd: root, encoding: "utf8" },
  );
  if (generated.status !== 0) throw new Error(generated.stderr);
  git(root, "branch", "main", "hostinger-static");
  git(root, "init", "--bare", remote);
  git(root, "remote", "add", "origin", remote);
  git(root, "push", "origin", "static-version", "hostinger-static", "main");
  return { root, remote };
}
afterEach(async () => {
  for (const directory of fixtures.splice(0)) {
    const path = resolve(directory);
    if (
      !path.startsWith(resolve(tmpdir()) + sep) ||
      !basename(path).startsWith("mary-release-test-")
    )
      throw new Error("Unexpected test directory");
    await rm(path, { recursive: true, force: true });
  }
});
describe("Automatic static releases", () => {
  it("increments versions, makes a real main merge and atomically publishes all refs", async () => {
    const { root, remote } = await fixture();
    git(root, "branch", "-D", "hostinger-static");
    const trigger = git(root, "rev-parse", "HEAD");
    expect(release(root, "prepare").status).toBe(0);
    expect(
      JSON.parse(await readFile(join(root, "package.json"), "utf8")).version,
    ).toBe("1.0.1");
    expect(
      JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"))
        .packages[""].version,
    ).toBe("1.0.1");
    expect(release(root, "assemble").status).toBe(0);
    const index = git(root, "write-tree");
    expect(release(root, "publish").status).toBe(0);
    const manifest = JSON.parse(git(remote, "show", "main:version.json"));
    expect(manifest.version).toBe("1.0.1");
    expect(manifest.triggerCommit).toBe(trigger);
    expect(
      git(remote, "rev-list", "--parents", "-n", "1", "main").split(" "),
    ).toHaveLength(3);
    expect(git(remote, "rev-parse", "v1.0.1")).toBe(
      git(remote, "rev-parse", "main"),
    );
    expect(git(remote, "show", "main:index.html")).toBe("<html>Mary</html>");
    expect(git(root, "write-tree")).toBe(index);
    expect(git(root, "branch", "--show-current")).toBe("static-version");
    expect(release(root, "prepare").stdout).toMatch(/Already published/);
    await writeFile(join(root, "change.txt"), "Next source change");
    git(root, "add", "change.txt");
    git(root, "commit", "-m", "Next source change");
    git(root, "push", "origin", "static-version");
    expect(release(root, "prepare").status).toBe(0);
    expect(
      JSON.parse(await readFile(join(root, "package.json"), "utf8")).version,
    ).toBe("1.0.2");
  }, 20000);
  it("skips a source event already published, without another bump", async () => {
    const { root } = await fixture();
    git(root, "branch", "-D", "hostinger-static");
    const trigger = git(root, "rev-parse", "HEAD");
    expect(release(root, "prepare").status).toBe(0);
    expect(release(root, "assemble").status).toBe(0);
    expect(release(root, "publish").status).toBe(0);
    git(root, "switch", "--detach", trigger);
    git(root, "branch", "-D", "static-version");
    git(root, "switch", "-c", "static-version");
    const result = release(root, "prepare");
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Already published/);
    expect(git(root, "rev-parse", "HEAD")).toBe(trigger);
  }, 20000);
  it("refuses stale refs without changing any remote branch", async () => {
    const { root, remote } = await fixture();
    const previousMain = git(remote, "rev-parse", "main");
    const previousHosting = git(remote, "rev-parse", "hostinger-static");
    expect(release(root, "prepare").status).toBe(0);
    expect(release(root, "assemble").status).toBe(0);
    const source = git(remote, "rev-parse", "static-version");
    const later = spawnSync(
      "git",
      ["commit-tree", git(root, "rev-parse", `${source}^{tree}`), "-p", source],
      { cwd: root, encoding: "utf8", input: "Later source change\n" },
    ).stdout.trim();
    git(root, "push", "origin", `${later}:refs/heads/static-version`);
    expect(release(root, "publish").status).not.toBe(0);
    expect(git(remote, "rev-parse", "main")).toBe(previousMain);
    expect(git(remote, "rev-parse", "hostinger-static")).toBe(previousHosting);
    expect(git(remote, "tag", "--list")).toBe("");
  }, 20000);
  it("keeps all remote refs unchanged when main has conflicting edits", async () => {
    const { root, remote } = await fixture();
    git(root, "switch", "main");
    await writeFile(join(root, "index.html"), "<html>Manual edit</html>");
    git(root, "add", "index.html");
    git(root, "commit", "-m", "Manual main edit");
    git(root, "push", "origin", "main");
    git(root, "switch", "static-version");
    const previousMain = git(remote, "rev-parse", "main");
    expect(release(root, "prepare").status).toBe(0);
    await writeFile(join(root, "out/index.html"), "<html>Mary changed</html>");
    expect(release(root, "assemble").status).not.toBe(0);
    expect(git(remote, "rev-parse", "main")).toBe(previousMain);
    expect(git(remote, "tag", "--list")).toBe("");
  }, 20000);
  it("rolls back every remote branch if an atomic push rejects the version tag", async () => {
    const { root, remote } = await fixture();
    const original = Object.fromEntries(
      ["main", "hostinger-static", "static-version"].map((name) => [
        name,
        git(remote, "rev-parse", name),
      ]),
    );
    expect(release(root, "prepare").status).toBe(0);
    expect(release(root, "assemble").status).toBe(0);
    // Simulate another actor reserving the tag after the preflight checks.
    git(root, "push", "origin", `${original.main}:refs/tags/v1.0.1`);
    expect(release(root, "publish").status).not.toBe(0);
    for (const [name, sha] of Object.entries(original))
      expect(git(remote, "rev-parse", name)).toBe(sha);
    expect(git(remote, "rev-parse", "v1.0.1")).toBe(original.main);
  }, 20000);
  it("refuses publication outside Actions", async () => {
    const { root } = await fixture();
    const result = spawnSync(
      process.execPath,
      ["scripts/release-static.mjs", "publish"],
      {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, GITHUB_ACTIONS: "false" },
      },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/restricted to GitHub Actions/);
  });
});
