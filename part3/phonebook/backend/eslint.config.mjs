import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import stylistic from "@stylistic/eslint-plugin-js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"]
  },
  {
    languageOptions: {
      sourceType: "module",
      globals: {...globals.node}
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      '@stylistic/js': stylistic
    },
    // do not use spacing, tabbing or similar rules; apparently they break cursor tabbing
    rules: {
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'no-trailing-spaces': [
        'error',
      ],
      'object-curly-spacing': [
        'error', 'always'
      ],
      'no-console': 'off',
    }
  }
];