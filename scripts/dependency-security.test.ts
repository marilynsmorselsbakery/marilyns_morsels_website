import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

const fromProject = createRequire(import.meta.url);
const fromEstree = createRequire(
  fromProject.resolve("@typescript-eslint/typescript-estree")
);
const { minimatch } = fromEstree("minimatch") as {
  minimatch: (file: string, pattern: string) => boolean;
};
const { version } = fromEstree("minimatch/package.json") as { version: string };
const parser = fromProject("@typescript-eslint/parser") as {
  parseForESLint: (
    source: string,
    options: Record<string, unknown>
  ) => { services: { program?: unknown } };
};

// GHSA-g3hv-75wg-m249 has no compatible fix in typescript-estree's declared
// minimatch 10.x range. Keep the override scoped to that consumer and cover
// its actual project-service glob matching, not only package installation.
describe("patched TypeScript ESLint glob dependency", () => {
  it("resolves the patched minimatch major for typescript-estree", () => {
    expect(Number(version.split(".")[0])).toBeGreaterThanOrEqual(11);
  });

  it.each([
    ["config/eslint.config.ts", "config/*.ts", true],
    ["config/nested/file.ts", "config/*.ts", false],
    [".hidden.ts", "*.ts", false],
    ["eslint.config.mjs", "eslint.config.{js,mjs,cjs}", true],
    ["nested/deep/file.ts", "**/*.ts", true],
    ["config.js", "*.ts", false],
  ] as const)("matches %s against %s correctly", (file, pattern, expected) => {
    expect(minimatch(file, pattern)).toBe(expected);
  });

  const options = (fileName: string) => ({
    filePath: path.join(process.cwd(), fileName),
    tsconfigRootDir: process.cwd(),
    projectService: {
      allowDefaultProject: ["eslint-security-*.js"],
      defaultProject: "tsconfig.json",
    },
    sourceType: "module",
    ecmaVersion: 2022,
  });

  it("lets the actual parser resolve an allowed default-project file", () => {
    const result = parser.parseForESLint(
      "const value = 1;",
      options("eslint-security-fixture.js")
    );
    expect(result.services.program).toBeDefined();
  });

  it("keeps rejecting a file outside the allowed default-project glob", () => {
    expect(() =>
      parser.parseForESLint(
        "const value = 1;",
        options("other-security-fixture.js")
      )
    ).toThrow(/was not found by the project service/);
  });
});
