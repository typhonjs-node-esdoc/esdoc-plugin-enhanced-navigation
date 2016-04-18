'use strict';

import fs         from 'fs-extra';
import path       from 'path';

import IceCap     from 'ice-cap';
import DocBuilder from 'esdoc/out/src/Publisher/Builder/DocBuilder.js';

/**
 * Enhanced Navigation Output Builder class.
 */
export default class EnhancedNavDocBuilder extends DocBuilder
{
   /**
    * Create instance.
    *
    * @param {object}   data - Taffy doc object database.
    * @param {object}   config - esdoc config is used build output.
    */
   constructor(data, config)
   {
      super(data, config);
   }

   /**
    * Build navigation output.
    *
    * @return {string} HTML navigation output.
    * @private
    */
   buildNavDoc()
   {
      const html = this._readTemplate('testnav.html');
      const ice = new IceCap(html);

      //const kinds = ['class', 'function', 'variable', 'typedef', 'external'];
      //const allDocs = this._find({ kind: kinds }).filter((v) => !v.builtinExternal);
      //const kindOrder = { 'class': 0, 'interface': 1, 'function': 2, 'variable': 3, 'typedef': 4, 'external': 5 };
      //
      //allDocs.sort((a, b) =>
      //{
      //   const filePathA = a.longname.split('~')[0].replace('src/', '');
      //   const filePathB = b.longname.split('~')[0].replace('src/', '');
      //   const dirPathA = path.dirname(filePathA);
      //   const dirPathB = path.dirname(filePathB);
      //   const kindA = a.interface ? 'interface' : a.kind;
      //   const kindB = b.interface ? 'interface' : b.kind;
      //
      //   if (dirPathA === dirPathB)
      //   {
      //      if (kindA === kindB) { return a.longname > b.longname ? 1 : -1; }
      //      else { return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1; }
      //   }
      //   else
      //   {
      //      return dirPathA > dirPathB ? 1 : -1;
      //   }
      //});
      //
      //let lastDirPath = '.';
      //
      //ice.loop('doc', allDocs, (i, doc, ice) =>
      //{
      //   const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
      //   const dirPath = path.dirname(filePath);
      //   const kind = doc.interface ? 'interface' : doc.kind;
      //   const kindText = kind.charAt(0).toUpperCase();
      //   const kindClass = `kind-${kind}`;
      //
      //   ice.load('name', this._buildDocLinkHTML(doc.longname));
      //   ice.load('kind', kindText);
      //   ice.attr('kind', 'class', kindClass);
      //   ice.text('dirPath', dirPath);
      //   ice.drop('dirPath', lastDirPath === dirPath);
      //   lastDirPath = dirPath;
      //});

      return ice.html;
   }

   /**
    * Attempts to first read local html template before deferring to ESDoc for loading templates.
    *
    * @param {string} fileName - template file name.
    *
    * @return {string} html of template.
    * @private
    */
   _readTemplate(fileName)
   {
      try
      {
         const filePath = path.resolve(__dirname, `../template/html/${fileName}`);
         return fs.readFileSync(filePath, { encoding: 'utf-8' });
      }
      catch (err) { /* ... */ }

      return super._readTemplate(fileName);
   }
}