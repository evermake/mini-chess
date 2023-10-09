import antfu from "@antfu/eslint-config"

export default antfu(
  {},
  {
    rules: {
      "arrow-parens": ["error", "always"],
      "curly": ["error", "all"],

      "style/quotes": ["error", "double"],
      "style/brace-style": ["error", "1tbs"],

      "ts/consistent-type-definitions": ["error", "type"],
    },
  },
)
