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


      /*
       <ul class="nav-accordion-menu animated">
       <li data-ice="navGroup" class="has-children">
       <span data-ice="groupInput"></span> <!-- <input type="checkbox" name="" id="" checked><label for="" class="nav-header"></label> -->
       <ul>
       <li data-ice="navFolder" class="has-children">
       <span data-ice="folderInput"></span> <!--<input type="checkbox" name="" id=""><label for="" data-ice="dirPath" class="nav-dir-path"></label> -->
       <ul>
       <li data-ice="doc" class=""><span data-ice="docLink"></span></li> <!-- <a href=""></a> -->
       </ul>
       </li>
       </ul>
       </li>
       </ul>

       <!-- <a href=""></a> -->
       */
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
                  docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', link: '#' },
                     { type: 'nav-kind-interface', name: 'Interface', link: '#' },
                     { type: 'nav-kind-function', name: 'Function', link: '#' },
                     { type: 'nav-kind-variable', name: 'Variable', link: '#' },
                     { type: 'nav-kind-typedef', name: 'Typedef', link: '#' },
                     { type: 'nav-kind-external', name: 'External', link: '#' }
                  ]
               },
               {
                  checked: true,
                  path: 'src1',
                  docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', link: '#' },
                     { type: 'nav-kind-interface', name: 'Interface', link: '#' },
                     { type: 'nav-kind-function', name: 'Function', link: '#' },
                     { type: 'nav-kind-variable', name: 'Variable', link: '#' },
                     { type: 'nav-kind-typedef', name: 'Typedef', link: '#' },
                     { type: 'nav-kind-external', name: 'External', link: '#' }
                  ]
               },
               {
                  checked: true,
                  path: 'src2',
                  docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', link: '#' },
                     { type: 'nav-kind-interface', name: 'Interface', link: '#' },
                     { type: 'nav-kind-function', name: 'Function', link: '#' },
                     { type: 'nav-kind-variable', name: 'Variable', link: '#' },
                     { type: 'nav-kind-typedef', name: 'Typedef', link: '#' },
                     { type: 'nav-kind-external', name: 'External', link: '#' }
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
                  folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: '#' }
                        ]
                     }
                  ]
               },
               {
                  checked: false,
                  name: 'jspm-package2',
                  folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'JSPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'JSPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'JSPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'JSPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'JSPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'JSPMExternal', link: '#' }
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
                  folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: '#' }
                        ]
                     }
                  ]
               },
               {
                  checked: false,
                  name: 'npm-package2',
                  folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: '#' }
                        ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        docs:
                        [
                           { type: 'nav-kind-class', name: 'NPMClass', link: '#' },
                           { type: 'nav-kind-interface', name: 'NPMInterface', link: '#' },
                           { type: 'nav-kind-function', name: 'NPMFunction', link: '#' },
                           { type: 'nav-kind-variable', name: 'NPMVariable', link: '#' },
                           { type: 'nav-kind-typedef', name: 'NPMTypedef', link: '#' },
                           { type: 'nav-kind-external', name: 'NPMExternal', link: '#' }
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
      return `<a href="${doc.link}">${doc.name}</a>`;
   }

   _buildFolderHTML(cntr, folder)
   {
      return `<input type="checkbox" name="folder-${cntr}" id="folder-${cntr}"${folder.checked ? ' checked' : ''}><label for="folder-${cntr}" data-ice="dirPath" class="nav-dir-path">${folder.path}</label>`;
   }

   _buildGroupHTML(cntr, group)
   {
      return `<input type="checkbox" name="group-${cntr}" id="group-${cntr}"${group.checked ? ' checked' : ''}><label for="group-${cntr}" class="nav-header">${group.name}</label>`;
   }

   _buildPackageHTML(cntr, packageData)
   {
      return `<input type="checkbox" name="package-${cntr}" id="package-${cntr}"${packageData.checked ? ' checked' : ''}><label for="package-${cntr}" data-ice="dirPath" class="nav-dir-path">${packageData.name}</label>`;
   }

   /**
    * Build navigation output.
    *
    * @return {string} HTML navigation output.
    * @private
    */
   buildNavDocOld()
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