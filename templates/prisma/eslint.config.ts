import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import eslintParserTs from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: eslintParserTs,
      sourceType: "module",
      ecmaVersion: "latest",
    },

    /* Plugins */
    plugins: {
      "@typescript-eslint": eslintPluginTs,
    },

    /* Roles */
    rules: {
      "no-console": ["warn", { allow: ["log", "warn", "error", "info"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "error",
      eqeqeq: "error",
    },
  },
];
