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
      const iceNav = new IceCap(this._readTemplate('nav.html'));
      const iceNavLocal = new IceCap(this._readTemplate('nav-local.html'));
      const iceNavManaged = new IceCap(this._readTemplate('nav-managed.html'));

      const kinds = ['class', 'function', 'variable', 'typedef', 'external'];
      const allDocs = this._find({ kind: kinds }).filter((v) => !v.builtinExternal);
      const kindOrder = { 'class': 0, 'interface': 1, 'function': 2, 'variable': 3, 'typedef': 4, 'external': 5 };

      allDocs.sort((a, b) =>
      {
         const filePathA = a.longname.split('~')[0].replace('src/', '');
         const filePathB = b.longname.split('~')[0].replace('src/', '');
         const dirPathA = path.dirname(filePathA);
         const dirPathB = path.dirname(filePathB);
         const kindA = a.interface ? 'interface' : a.kind;
         const kindB = b.interface ? 'interface' : b.kind;

         if (dirPathA === dirPathB)
         {
            if (kindA === kindB) { return a.longname > b.longname ? 1 : -1; }
            else { return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1; }
         }
         else
         {
            return dirPathA > dirPathB ? 1 : -1;
         }
      });

      let lastDirPath = '.';

      const localData =
      [
         {
            checked: true,
            name: 'Local Source',
            folders:
            [
               {
                  checked: true,
                  path: 'src',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'Github',
                  docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-interface', name: 'Interface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-function', name: 'Function', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-variable', name: 'Variable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-typedef', name: 'Typedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-external', name: 'External', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                  ]
               },
               {
                  checked: true,
                  path: 'src1',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'Github',
                  docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-interface', name: 'Interface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-function', name: 'Function', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-variable', name: 'Variable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-typedef', name: 'Typedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-external', name: 'External', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                  ]
               },
               {
                  checked: true,
                  path: 'src2',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'Github',
                  docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-interface', name: 'Interface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-function', name: 'Function', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-variable', name: 'Variable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-typedef', name: 'Typedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                     { type: 'nav-kind-external', name: 'External', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                  ]
               }
            ]
         }
      ];

      const managedData =
      [
         {
            checked: false,
            name: 'JSPM Managed Source',

            packages:
            [
               {
                  checked: false,
                  name: 'jspm-package1',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'Github',
                  folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'Github',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'Github',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'Github',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                        ]
                     }
                  ]
               },
               {
                  checked: false,
                  name: 'jspm-package2',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'Github',
                  folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'Github',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'Github',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'Github',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'Github' }
                        ]
                     }
                  ]
               }
            ]
         },
         {
            checked: false,
            name: 'NPM Managed Source',

            packages:
            [
               {
                  checked: false,
                  name: 'npm-package1',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'NPM',
                  folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'NPM',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'NPM',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'NPM',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' }
                        ]
                     }
                  ]
               },
               {
                  checked: false,
                  name: 'npm-package2',
                  scmLink: 'https://github.com/typhonrt',
                  scmType: 'NPM',
                  folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'NPM',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'NPM',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        scmLink: 'https://github.com/typhonrt',
                        scmType: 'NPM',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: 'https://github.com/typhonrt', scmLink: 'https://github.com/typhonrt', scmType: 'NPM' }
                        ]
                     }
                  ]
               }
            ]
         }
      ];

      let groupCntr = 0;
      let folderCntr = 0;
      let packageCntr = 0;

      iceNavLocal.loop('navGroup', localData, (cntr, group, ice) =>
      {
         ice.loop('navFolder', group.folders, (cntr, folder, ice) =>
         {
            ice.loop('doc', folder.docs, (cntr, doc, ice) =>
            {
               ice.attr('doc', 'class', doc.type);
               ice.load('docLink', this._buildDocLinkHTML(doc));
            });

            ice.load('navFolder', this._buildFolderHTML(folderCntr++, folder), IceCap.MODE_PREPEND);
         });

         ice.load('navGroup', this._buildGroupHTML(groupCntr++, group), IceCap.MODE_PREPEND);
      });

      iceNavManaged.loop('navGroup', managedData, (cntr, group, ice) =>
      {
         ice.loop('navPackage', group.packages, (cntr, packageData, ice) =>
         {
            ice.loop('navFolder', packageData.folders, (cntr, folder, ice) =>
            {
               ice.loop('doc', folder.docs, (cntr, doc, ice) =>
               {
                  ice.attr('doc', 'class', doc.type);
                  ice.load('docLink', this._buildDocLinkHTML(doc));
               });

               ice.load('navFolder', this._buildFolderHTML(folderCntr++, folder), IceCap.MODE_PREPEND);
            });

            ice.load('navPackage', this._buildPackageHTML(packageCntr++, packageData), IceCap.MODE_PREPEND);
         });

         ice.load('navGroup', this._buildGroupHTML(groupCntr++, group), IceCap.MODE_PREPEND);
      });

      iceNav.load('navData', iceNavLocal);
      iceNav.load('navData', iceNavManaged);

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

      return iceNav.html;
   }

   _buildDocLinkHTML(doc)
   {
      const link = doc.scmLink ? ` data-scm-link=${doc.scmLink}` : '';
      const type = doc.scmType ? ` data-scm-type=${doc.scmType}` : '';
      return `<a href="${doc.link}"${link}${type}>${doc.name}</a>`;
   }

   _buildFolderHTML(cntr, folder)
   {
      const link = folder.scmLink ? ` data-scm-link=${folder.scmLink}` : '';
      const type = folder.scmType ? ` data-scm-type=${folder.scmType}` : '';
      return `<input type="checkbox" name="folder-${cntr}" id="folder-${cntr}"${folder.checked ? ' checked' : ''}>`
       + `<label for="folder-${cntr}" class="nav-dir-path" data-ice="dirPath"${link}${type}>${folder.path}</label>`;
   }

   _buildGroupHTML(cntr, group)
   {
      return `<input type="checkbox" name="group-${cntr}" id="group-${cntr}"${group.checked ? ' checked' : ''}>`
       + `<label for="group-${cntr}" class="nav-header">${group.name}</label>`;
   }

   _buildPackageHTML(cntr, data)
   {
      const link = data.scmLink ? ` data-scm-link=${data.scmLink}` : '';
      const type = data.scmType ? ` data-scm-type=${data.scmType}` : '';
      return `<input type="checkbox" name="package-${cntr}" id="package-${cntr}"${data.checked ? ' checked' : ''}>`
       + `<label for="package-${cntr}" class="nav-package" data-ice="dirPath"${link}${type}>${data.name}</label>`;
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