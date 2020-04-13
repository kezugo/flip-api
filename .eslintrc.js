module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier/@typescript-eslint",
    "prettier"
  ],
  "plugins": [
    "simple-import-sort",
    "@typescript-eslint/eslint-plugin",
    "prettier"
  ],
  "root": true,
  "env": {
    "node": true,
    "jest": true,
    "es6": true
  },
  "parserOptions": {
    "project": "tsconfig.json",
    "ecmaVersion": 2019,
    "sourceType": "module",
  },
  "rules": {
    // "sort-imports": ["error", {
    //   "ignoreCase": false,
    //   "ignoreDeclarationSort": false,
    //   "ignoreMemberSort": false,
    //   "memberSyntaxSortOrder": ["none", "multiple", "single", "all"]
    // }],
    "simple-import-sort/sort": "error",
    "jsx-no-lambda": "off",
    "jsx-boolean-value": "off",
    "no-string-literal": "off",
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": false
      }
    ],
    "member-ordering": "off",
    "member-access": "off",
    "no-console": "off",
    "require-atomic-updates": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit",
        "overrides": {
          "accessors": "no-public",
          "constructors": "no-public",
          "methods": "off",
          "properties": "off",
          "parameterProperties": "explicit"
        }
      }
    ],
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": true
      }
    ],
    "@typescript-eslint/indent": "off",
  },
};
