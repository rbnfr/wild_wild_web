import { execFileSync } from "node:child_process";

const git = (...args: string[]) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

// Date of the last commit that touched any of the sources. A shallow clone
// would report its boundary commit instead, so it yields no date at all.
export function lastModified(sources: readonly string[]): string | undefined {
  try {
    if (git("rev-parse", "--is-shallow-repository") !== "false")
      return undefined;
    // Literal pathspecs: route folders such as "[lang]" are not globs.
    return (
      git(
        "--literal-pathspecs",
        "log",
        "-1",
        "--format=%cI",
        "--",
        ...sources,
      ) || undefined
    );
  } catch {
    return undefined;
  }
}
