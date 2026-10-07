import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const fixtures: string[] = [];
function git(root: string, ...args: string[]) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "mary-git-test-"));
  fixtures.push(root);
  await mkdir(join(root, "scripts"));
  await writeFile(
    join(root, "scripts/prepare-git-deploy.mjs"),
    await readFile("scripts/prepare-git-deploy.mjs"),
  );
  await writeFile(join(root, ".gitignore"), "out/\n");
  git(root, "init", "-b", "test-static-version");
  git(root, "config", "user.name", "Deployment Test");
  git(root, "config", "user.email", "deployment-test@example.invalid");
  git(root, "add", ".");
  git(root, "commit", "-m", "Fixture source");
  for (const name of [
    "index.html",
    ".htaccess",
    "404.html",
    "privacidad/index.html",
    "aviso-legal/index.html",
    "cookies/index.html",
    "robots.txt",
    "sitemap.xml",
    "images/photo.webp",
  ]) {
    const path = join(root, "out", name);
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(
      path,
      name === "index.html" ? "<html>Mary Granero</html>" : "fixture",
    );
  }
  return root;
}
function generate(root: string) {
  return spawnSync(process.execPath, ["scripts/prepare-git-deploy.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
}
afterEach(async () => {
  for (const root of fixtures.splice(0)) {
    const path = resolve(root);
    if (
      !path.startsWith(resolve(tmpdir()) + sep) ||
      !basename(path).startsWith("mary-git-test-")
    )
      throw new Error("Unexpected test directory");
    await rm(path, { recursive: true, force: true });
  }
});

describe("Hostinger Git deployment branch", () => {
  it("publishes the export at the root and preserves the checkout and index", async () => {
    const root = await fixture();
    const source = git(root, "rev-parse", "HEAD");
    const index = git(root, "write-tree");
    expect(generate(root).status).toBe(0);
    expect(git(root, "show", "codex/hostinger-static:index.html")).toBe(
      "<html>Mary Granero</html>",
    );
    expect(
      git(root, "ls-tree", "-r", "--name-only", "codex/hostinger-static"),
    ).not.toMatch(/scripts|out\/|package.json|\.gitignore/);
    expect(
      git(root, "ls-tree", "codex/hostinger-static", "index.html"),
    ).toMatch(/^100644 blob/);
    expect(git(root, "rev-parse", "HEAD")).toBe(source);
    expect(git(root, "write-tree")).toBe(index);
    expect(git(root, "status", "--porcelain")).toBe("");
    const first = git(root, "rev-parse", "codex/hostinger-static");
    expect(generate(root).status).toBe(0);
    expect(git(root, "rev-parse", "codex/hostinger-static")).toBe(first);
    await writeFile(
      join(root, "out/index.html"),
      "<html>Mary actualizado</html>",
    );
    expect(generate(root).status).toBe(0);
    expect(git(root, "rev-parse", "codex/hostinger-static^")).toBe(first);
  });
  it("refuses a missing index or a private file without creating a branch", async () => {
    const root = await fixture();
    await rm(join(root, "out/index.html"));
    expect(generate(root).status).not.toBe(0);
    await writeFile(join(root, "out/index.html"), "Mary");
    await writeFile(join(root, "out/.env.local"), "private fixture");
    expect(generate(root).status).not.toBe(0);
    expect(git(root, "branch", "--list", "codex/hostinger-static")).toBe("");
  });
  it("refuses to overwrite an unrelated branch", async () => {
    const root = await fixture();
    git(root, "branch", "codex/hostinger-static");
    const previous = git(root, "rev-parse", "codex/hostinger-static");
    expect(generate(root).status).not.toBe(0);
    expect(git(root, "rev-parse", "codex/hostinger-static")).toBe(previous);
  });
  it("requires committed source changes", async () => {
    const root = await fixture();
    await writeFile(join(root, "uncommitted.txt"), "change");
    expect(generate(root).status).not.toBe(0);
    expect(git(root, "branch", "--list", "codex/hostinger-static")).toBe("");
  });
});
