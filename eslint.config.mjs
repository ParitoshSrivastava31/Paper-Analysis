import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    extends: ['next'],
    rules: {
      "react/no-unescaped-entities": "off",
      // Additional custom rule overrides:
      "@typescript-eslint/quotes": "off",
      quotes: "off",
      // If you need to override options for quotes, consider:
      // quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }]
      "no-useless-escape": "off",
    },
  },
];

export default eslintConfig;
