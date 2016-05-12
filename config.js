/**
 * Provides an empty SystemJS config.js which is only populated and used during testing.
 */
System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
  },

  map: {
  }
});