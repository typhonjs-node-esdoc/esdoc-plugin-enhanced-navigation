/**
 * esdoc-plugin-enhanced-navigation -- In development...
 */

'use strict';

import cheerio                from 'cheerio';
import fs                     from 'fs-extra';
import path                   from 'path';
import { taffy }              from 'taffydb';

import EnhancedNavDocBuilder  from './EnhancedNavDocBuilder.js';

let option, silent;

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
   option = ev.data.option || {};
   silent = option.silent || false;
}

/**
 * Stores ESDoc configuration file.
 *
 * @param {object}   ev - Event from ESDoc containing data field.
 */
export function onHandleConfig(ev)
{
   config = ev.data.config;
   s_COPY_FILES(config.destination);
}

/**
 * Since the source root is "." / the base root of the repo ESDoc currently creates the wrong import path, so they
 * need to be corrected. ESDoc fabricates "<package name>/<base root>" when we want just "<package name>/" for the local
 * project code. For the JSPM packages the import statement is "<package name>/<base root>/<JSPM path>" where
 * the desired path is the just the normalized JSPM path to the associated package.
 *
 * @param {object}   ev - Event from ESDoc containing data field
 */
export function onHandleTag(ev)
{
   navHTML = new EnhancedNavDocBuilder(taffy(ev.data.tag), config).buildNavDoc();
}

/**
 * The generated HTML also includes the full JSPM path, so various RegExp substitutions are run to transform the
 * full paths to the normalized JSPM package paths.
 *
 * @param {object}   ev - Event from ESDoc containing data field
 */
export function onHandleHTML(ev)
{
   if (ev.data.fileName.endsWith('.html'))
   {
      const $ = cheerio.load(ev.data.html, { decodeEntities: false });

      $('head link').eq(0).append('\n  <link type="text/css" rel="stylesheet" href="css/nav-accordion-style.css"/>');
      $('head link').eq(0).append('\n  <link type="text/css" rel="stylesheet" href="css/esdoc-nav-style.css"/>');
      $('head link').eq(0).append('\n  <link type="text/css" rel="stylesheet" href="css/extra-style.css"/>');

//      $('head').append('  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js"></script>\n');

      // Replace standard navigation with JSPM navigation.
      if ($('.navigation').data('ice') === 'nav') { $('.navigation').html(navHTML); }

      ev.data.html = $.html();
   }
}

// Utility functions ------------------------------------------------------------------------------------------------

/**
 * Copies additional files to the doc destination.
 *
 * @param {string}   docDestination - ESDoc config destination relative to root path.
 */
const s_COPY_FILES = (docDestination) =>
{
   const sourcePath = path.resolve(__dirname, '../template/copy');
   const targetPath = path.resolve(process.cwd(), docDestination);
console

   fs.copySync(sourcePath, targetPath);
};