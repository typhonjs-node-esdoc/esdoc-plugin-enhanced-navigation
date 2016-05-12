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
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "backbone": "github:typhonjs-backbone-parse/backbone-parse-es6@master",
    "core-js": "npm:core-js@1.2.6",
    "underscore": "npm:underscore@1.8.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:typhonjs-backbone-parse/backbone-parse-es6@master": {
      "backbone-es6": "github:typhonjs-backbone/backbone-es6@master",
      "parse": "npm:parse@1.8.3",
      "typhonjs-core-backbone-common": "github:typhonjs-backbone/typhonjs-core-backbone-common@master",
      "typhonjs-core-backbone-events": "github:typhonjs-backbone/typhonjs-core-backbone-events@master",
      "typhonjs-core-backbone-query": "github:typhonjs-backbone/typhonjs-core-backbone-query@master",
      "typhonjs-core-utils": "github:typhonjs-common/typhonjs-core-utils@master",
      "underscore": "npm:underscore@1.8.3"
    },
    "github:typhonjs-backbone/backbone-es6@master": {
      "typhonjs-core-backbone-events": "github:typhonjs-backbone/typhonjs-core-backbone-events@master",
      "underscore": "npm:underscore@1.8.3"
    },
    "github:typhonjs-backbone/typhonjs-core-backbone-common@master": {
      "typhonjs-core-utils": "github:typhonjs-common/typhonjs-core-utils@master",
      "underscore": "npm:underscore@1.8.3"
    },
    "github:typhonjs-backbone/typhonjs-core-backbone-events@master": {
      "underscore": "npm:underscore@1.8.3"
    },
    "github:typhonjs-backbone/typhonjs-core-backbone-query@master": {
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:parse@1.8.3": {
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
