import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "next-env.d.ts",
    ".github/skills/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    files: ["src/**/*.tsx"],
    extends: [
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    rules: {
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["href"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
    },
  },
  // This validation intentionally matches control characters to reject them.
  {
    files: ["src/lib/contact/schema.ts"],
    rules: { "no-control-regex": "off" },
  },
]);
