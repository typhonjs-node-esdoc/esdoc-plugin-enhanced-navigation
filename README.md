![esdoc-plugin-enhanced-navigation](https://i.imgur.com/ocKmW6A.png)

[![NPM](https://img.shields.io/npm/v/esdoc-plugin-enhanced-navigation.svg?label=npm)](https://www.npmjs.com/package/esdoc-plugin-enhanced-navigation)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation.svg?branch=master)](https://travis-ci.org/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation.svg)](https://codecov.io/github/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation)
[![Dependency Status](https://www.versioneye.com/user/projects/5727e02aa0ca350034be631d/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5727e02aa0ca350034be631d)

A plugin for [ESDoc](https://esdoc.org) that replaces the left-hand navigation / class browser with an enhanced version which includes a folder accordion, a context menu that opens associated Github / NPM links and support for grouping managed packages via JSPM (and soon NPM) in separate sections from the local source.

Installation steps:
- Install `esdoc` in `devDependencies` in `package.json`.
- Install `esdoc-plugin-enhanced-navigation` in `devDependencies` in `package.json`.
- Optionally install [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) if using JSPM / SystemJS in `devDependencies` in `package.json`.
- Create an `.esdocrc` or `esdoc.json` configuration file adding the plugin.
- Optionally add an `.esdocrc` or `esdoc.json` configuration file in all JSPM managed packages to link.
- Run ESdoc then profit!

For more information view the [ESDoc tutorial](https://esdoc.org/tutorial.html) and [ESDoc Config](https://esdoc.org/config.html) documentation.

It should be noted that all TyphonJS repos now are standardizing on `.esdocrc` for the ESDoc configuration file. Both `.esdocrc` and `esdoc.json` are supported by this plugin. 

As an alternate and the preferred all inclusive installation process please see [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) for a NPM package which contains several dependencies for building / testing ES6 NPM modules including ESDoc generation with the following plugins including [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm), [esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace). 
Please note that the next release of `typhonjs-npm-build-test` will include `esdoc-plugin-enhanced-navigation` and presently it is not included. When `esdoc-plugin-enhanced-navigation` reaches `0.1.0` it will be included in `typhonjs-npm-build-test` version `0.2.0`.

Additionally [typhonjs-core-gulptasks](https://www.npmjs.com/package/typhonjs-core-gulptasks) provides a NPM package which contains several pre-defined Gulp tasks for working with JSPM / SystemJS, ESLint and ESDoc generation. 

For the latest significant changes please see the [CHANGELOG](https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/blob/master/CHANGELOG.md).

If installing and working directly with `esdoc-plugin-enhanced-navigation` the following is an example integration including JSPM support via `esdoc-plugin-jspm` for `package.json`:
```
{
  ...

  "devDependencies": {
    "esdoc": "^0.4.0",
    "esdoc-plugin-enhanced-navigation": "^0.0.2",  
    "esdoc-plugin-jspm": "^0.6.0",  // Optional if using JSPM
    "jspm": "^0.16.0"
  },
  "scripts": {
    "esdoc": "esdoc -c .esdocrc"
  },
  "jspm": {
    "main": "<main entry point>",
    "dependencies": {
      ...
    },
     "devDependencies": {
      ...
    }
  }
}
```

And the `.esdocrc` or `esdoc.json` configuration file:

```
{
   "title": "<title>",
   "source": "src",
   "destination": "docs",
   "plugins": 
   [ 
      { "name": "esdoc-plugin-jspm" },  // Optional if using JSPM
      { "name": "esdoc-plugin-enhanced-navigation" }
   ]
}
```

Given the NPM script defined in `package.json` then simply run `npm run esdoc`.

------

Below is a demo image of the replaced left-hand navigation. A few of the pertinent details include that the local source is grouped at the top section with any JSPM / NPM managed source code grouped in follow up sections. While not pictured a context click on folders and source code opens a context menu which will provide links to Github or NPM depending on the code being managed. For the context menu links to work for NPM packages you must include the [repository field](https://docs.npmjs.com/files/package.json#repository) in `package.json`. JSPM currently supports packages from Github and NPM; Github packages are colored orange and NPM packages are colored light red. 

![esdoc-plugin-enhanced-navigation demo](https://i.imgur.com/OjpD7rl.png)
