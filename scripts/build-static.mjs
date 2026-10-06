import { rm, realpath, lstat } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = await realpath(
  fileURLToPath(new URL("..", import.meta.url)),
);
process.chdir(projectRoot);
const outputDirectory = resolve(projectRoot, "out");
if (
  dirname(outputDirectory) !== projectRoot ||
  basename(outputDirectory) !== "out"
)
  throw new Error("Unexpected export directory");
const outputInfo = await lstat(outputDirectory).catch((error) => {
  if (error.code === "ENOENT") return undefined;
  throw error;
});
if (outputInfo?.isSymbolicLink())
  throw new Error(
    "Refusing to clean an export directory that is a symbolic link",
  );
await rm(outputDirectory, { recursive: true, force: true });

const origin =
  process.env.NEXT_PUBLIC_SITE_URL || "https://marywildbehavior.com";
const url = new URL(origin);
if (
  url.protocol !== "https:" ||
  url.pathname !== "/" ||
  url.search ||
  url.hash ||
  url.username ||
  url.password ||
  ["localhost", "127.0.0.1"].includes(url.hostname)
) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be a public HTTPS origin, without paths or credentials.",
  );
}
await import("./prepare-images.mjs");
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL("../node_modules/next/dist/bin/next", import.meta.url),
    ),
    "build",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: url.origin },
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);
await import("./export-static.mjs");
