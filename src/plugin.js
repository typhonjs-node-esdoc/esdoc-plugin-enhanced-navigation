/**
 * esdoc-plugin-enhanced-navigation -- In development...
 */

'use strict';

import cheerio                from 'cheerio';
import fs                     from 'fs-extra';
import path                   from 'path';
import { taffy }              from 'taffydb';

import EnhancedNavDocBuilder  from './EnhancedNavDocBuilder.js';

let option;

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
   option.silent = option.silent || false;
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

   fs.copySync(sourcePath, targetPath);
};