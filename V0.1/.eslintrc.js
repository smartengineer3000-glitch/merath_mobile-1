module.exports = {
  extends: "expo",
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    "**/.expo/**",
    "**/e2e/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.test.ts",
    "**/*.test.tsx",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/array-type": "warn",
    "import/no-named-as-default": "warn",
    "import/no-named-as-default-member": "warn",
    "no-undef": "warn",
  },
};
