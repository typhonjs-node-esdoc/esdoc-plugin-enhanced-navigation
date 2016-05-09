/**
 * esdoc-plugin-enhanced-navigation -- A plugin for [ESDoc](https://esdoc.org) that replaces the left-hand navigation /
 * class browser with an enhanced version which includes a folder accordion, a context menu that opens associated
 * Github / NPM links and support for grouping managed packages via JSPM (and soon NPM) in separate sections from the
 * local source.
 *
 * Installation steps:
 * - Install `esdoc` in `devDependencies` in `package.json`.
 * - Install `esdoc-plugin-enhanced-navigation` in `devDependencies` in `package.json`.
 * - Optionally install [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) if using JSPM / SystemJS in
 *   `devDependencies` in `package.json`.
 * - Create an `.esdocrc` or `esdoc.json` configuration file adding the plugin.
 * - Optionally add an `.esdocrc` or `esdoc.json` configuration file in all JSPM managed packages to link.
 * - Run ESdoc then profit!
 *
 * For more information view the [ESDoc tutorial](https://esdoc.org/tutorial.html) and
 * [ESDoc Config](https://esdoc.org/config.html) documentation.
 *
 * It should be noted that all TyphonJS repos now are standardizing on `.esdocrc` for the ESDoc configuration file. Both
 * `.esdocrc` and `esdoc.json` are supported by the `esdoc-plugin-jspm` and forthcoming `esdoc-plugin-npm` plugin.
 *
 * As an alternate and the preferred all inclusive installation process please see
 * [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) for a NPM package which contains
 * several dependencies for building / testing ES6 NPM modules including ESDoc generation with the following plugins
 * including [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm),
 * [esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace).
 * Please note that the next release of `typhonjs-npm-build-test` will include `esdoc-plugin-enhanced-navigation` and
 * presently it is not included. When `esdoc-plugin-enhanced-navigation` reaches `0.1.0` it will be included in
 * `typhonjs-npm-build-test` version `0.2.0`.
 *
 * Additionally [typhonjs-core-gulptasks](https://www.npmjs.com/package/typhonjs-core-gulptasks) provides a NPM package
 * which contains several pre-defined Gulp tasks for working with JSPM / SystemJS, ESLint and ESDoc generation.
 *
 * For the latest significant changes please see the
 * [CHANGELOG](https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/blob/master/CHANGELOG.md).
 *
 * If installing and working directly with `esdoc-plugin-enhanced-navigation` the following is an example integration
 * including JSPM support via `esdoc-plugin-jspm` for `package.json`:
 * ```
 * {
 *   ...
 *
 *   "devDependencies": {
 *     "esdoc": "^0.4.0",
 *     "esdoc-plugin-enhanced-navigation": "^0.0.6",
 *     "esdoc-plugin-jspm": "^0.6.0",  // Optional if using JSPM
 *     "jspm": "^0.16.0"
 *   },
 *   "scripts": {
 *     "esdoc": "esdoc -c .esdocrc"
 *   },
 *   "jspm": {
 *     "main": "<main entry point>",
 *     "dependencies": {
 *       ...
 *     },
 *      "devDependencies": {
 *       ...
 *     }
 *   }
 * }
 * ```
 *
 * And the `.esdocrc` or `esdoc.json` configuration file:
 *
 * ```
 * {
 *    "title": "<title>",
 *    "source": "src",
 *    "destination": "docs",
 *    "plugins":
 *    [
 *       { "name": "esdoc-plugin-jspm" },  // Optional if using JSPM
 *       {
 *          "name": "esdoc-plugin-enhanced-navigation",
 *          "option:
 *          {
 *             "showAllFiles": "true"  // (Optional) If set to true then all doc tags will show the associated file
 *                                     // name; default is false.
 *          }
 *       }
 *    ]
 * }
 * ```
 *
 * `esdoc-plugin-enhanced-navigation` accepts the following configuration option:
 * - showAllFiles - If set to true then all doc tags will show the associated file name; default is false.
 *
 * By default for folders where all files export a single default or named export which matches the file name then the
 * file name for this single export is hidden. This is useful for efforts like TyphonJS which has a strict naming policy
 * where each file only has a default export which matches the file name.
 *
 * ------
 *
 * Given the NPM script defined in `package.json` then simply run `npm run esdoc`.
 */

'use strict';

import cheerio                from 'cheerio';
import fs                     from 'fs-extra';
import path                   from 'path';
import { taffy }              from 'taffydb';

import EnhancedNavDocBuilder  from './EnhancedNavDocBuilder.js';

let options;

// Must store ESDoc configuration file to use later with EnhancedNavDocBuilder.
let config, navHTML;

// ESDoc plugin callbacks -------------------------------------------------------------------------------------------

/**
 * Stores the option data from the plugin configuration and provides empty defaults as necessary.
 *
 * @param {object}   ev - Event from ESDoc containing data field.
 */
export function onStart(ev)
{
   options = ev.data.option || {};
   options.showAllFiles = typeof options.showAllFiles === 'boolean' ? options.showAllFiles : false;
   options.silent = typeof options.silent === 'boolean' ? options.silent : false;
}

/**
 * Stores ESDoc configuration file and copies extra files to doc output directory.
 *
 * @param {object}   ev - Event from ESDoc containing data field.
 */
export function onHandleConfig(ev)
{
   config = ev.data.config;
   s_COPY_FILES(config.destination);
}

/**
 * Generates the new left-hand side navigation HTML.
 *
 * @param {object}   ev - Event from ESDoc containing data field
 */
export function onHandleTag(ev)
{
   navHTML = new EnhancedNavDocBuilder(taffy(ev.data.tag), config, options).buildNavDoc();
   navHTML = navHTML.replace('data-nav-id=""', `data-nav-id="docs-nav-id-${Date.now()}"`);
}

/**
 * Replaces the left-hand side navigation on all relevant HTML pages of generated docs.
 *
 * @param {object}   ev - Event from ESDoc containing data field
 */
export function onHandleHTML(ev)
{
   if (ev.data.fileName.endsWith('.html'))
   {
      const $ = cheerio.load(ev.data.html);

      // Replace standard navigation with enhanced navigation.
      if ($('.navigation').data('ice') === 'nav' && $('.navigation').find('li[data-ice="doc"]').length > 0)
      {
         $('<link type="text/css" rel="stylesheet" href="css/mdl/material.min.css">\n  ').insertBefore(
          $('head link').eq(0));

         $('head link').eq(1).append(
          '\n  <link type="text/css" rel="stylesheet" href="css/mdl/material.override.css"/>');

         $('head link').eq(1).append(
          '\n  <link type="text/css" rel="stylesheet" href="css/navigation/nav-accordion-style.css"/>');

         $('head link').eq(1).append(
          '\n  <link type="text/css" rel="stylesheet" href="css/navigation/esdoc-nav-style.css"/>');

         $('head link').eq(1).append(
          '\n  <link type="text/css" rel="stylesheet" href="css/scrollbar/webkit-style.css"/>');

         $('body').prepend(s_CONTEXT_POPUP);

         $('<script src="script/jquery/jquery.min.js"></script>\n').insertBefore(
          $('body script').eq(0));

         $('<script defer src="script/mdl/material.min.js"></script>\n').insertBefore(
          $('body script').eq(1));

         $('<script src="script/navigation/enhancednav.js"></script>\n').insertBefore($('body script').eq(1));

         $('.navigation').html(navHTML);
      }

      ev.data.html = $.html();
   }
}

// Utility functions ------------------------------------------------------------------------------------------------

/**
 * Defines the MDL context popup used for linking source to the respective SCM.
 */
const s_CONTEXT_POPUP =
 `
<div id="contextpopup">
   <button id="context-menu" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect hidden">
      <i class="material-icons">more_vert</i>
   </button>

   <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="context-menu">
      <li class="mdl-menu__item hidden" data-action="openLink">Open on ...</li>
      <li class="mdl-menu__item hidden" data-action="openLink">Open on ...</li>
      <li disabled class="mdl-menu__item hidden">Version: ...</li>
   </ul>
</div>
`;

/**
 * Copies additional files to the doc destination.
 *
 * @param {string}   docDestination - ESDoc config destination relative to root path.
 */
const s_COPY_FILES = (docDestination) =>
{
   const sourcePath = path.resolve(__dirname, '../template/copy');
   const targetPath = path.resolve(process.cwd(), docDestination);

   fs.copySync(sourcePath, targetPath, { clobber: true });
};