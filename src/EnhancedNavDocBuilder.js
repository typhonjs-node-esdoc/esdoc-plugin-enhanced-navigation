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
   _buildDocLinkHTML(doc)
   {
      let packageLink = '';
      let packageType = '';
      let scmLink = '';
      let scmType = '';

      if (doc.packageLink && doc.packageLink.link && doc.packageLink.type)
      {
         packageLink = ` data-package-link=${doc.packageLink.link}`;
         packageType = ` data-package-type=${doc.packageLink.type}`;
      }

      if (doc.scmLink && doc.scmLink.link && doc.scmLink.type)
      {
         scmLink = ` data-scm-link=${doc.scmLink.link}`;
         scmType = ` data-scm-type=${doc.scmLink.type}`;
      }

      return `<a href="${doc.docLink}"${packageLink}${packageType}${scmLink}${scmType}>${doc.name}</a>`;
   }

   _buildFolderHTML(cntr, folder)
   {
      let packageLink = '';
      let packageType = '';
      let scmLink = '';
      let scmType = '';

      if (folder.packageLink && folder.packageLink.link && folder.packageLink.type)
      {
         packageLink = ` data-package-link=${folder.packageLink.link}`;
         packageType = ` data-package-type=${folder.packageLink.type}`;
      }

      if (folder.scmLink && folder.scmLink.link && folder.scmLink.type)
      {
         scmLink = ` data-scm-link=${folder.scmLink.link}`;
         scmType = ` data-scm-type=${folder.scmLink.type}`;
      }

      return `<input type="checkbox" name="folder-${cntr}" id="folder-${cntr}"${folder.checked ? ' checked' : ''}>`
       + `<label for="folder-${cntr}" class="nav-dir-path" data-ice="dirPath"`
        + `${packageLink}${packageType}${scmLink}${scmType}>${folder.path}</label>`;
   }

   _buildGroupHTML(cntr, group)
   {
      return `<input type="checkbox" name="group-${cntr}" id="group-${cntr}"${group.checked ? ' checked' : ''}>`
       + `<label for="group-${cntr}" class="nav-header">${group.name}</label>`;
   }

   _buildPackageHTML(cntr, data)
   {
      let packageLink = '';
      let packageType = '';
      let scmLink = '';
      let scmType = '';

      if (data.packageLink && data.packageLink.link && data.packageLink.type)
      {
         packageLink = ` data-package-link=${data.packageLink.link}`;
         packageType = ` data-package-type=${data.packageLink.type}`;
      }

      if (data.scmLink && data.scmLink.link && data.scmLink.type)
      {
         scmLink = ` data-scm-link=${data.scmLink.link}`;
         scmType = ` data-scm-type=${data.scmLink.type}`;
      }

      return `<input type="checkbox" name="package-${cntr}" id="package-${cntr}"${data.checked ? ' checked' : ''}>`
       + `<label for="package-${cntr}" class="nav-package" data-ice="dirPath"`
        + `${packageLink}${packageType}${scmLink}${scmType}>${data.name}</label>`;
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

      // Sort by directory and kind.
      allDocs.sort((a, b) =>
      {
         const filePathA = a.longname.split('~')[0];
         const filePathB = b.longname.split('~')[0];
         const dirPathA = path.dirname(filePathA);
         const dirPathB = path.dirname(filePathB);
         const shortNameA = a.longname.split('~')[1];
         const shortNameB = b.longname.split('~')[1];
         const kindA = a.interface ? 'interface' : a.kind;
         const kindB = b.interface ? 'interface' : b.kind;

         if (dirPathA === dirPathB)
         {
            if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
            else { return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1; }
         }
         else
         {
            return dirPathA > dirPathB ? 1 : -1;
         }
      });

      const localData = [];
      const localDataFilter = [];
      const managedData = [];

      if (typeof global.$$esdoc_plugin_jspm === 'object' && typeof global.$$esdoc_plugin_jspm.packageData === 'object')
      {
         if (this._filterJSPMDocs(allDocs, managedData, global.$$esdoc_plugin_jspm.packageData))
         {
            localDataFilter.push('jspm_packages');
         }
      }

      if (typeof global.$$esdoc_plugin_npm === 'object' && typeof global.$$esdoc_plugin_npm.packageData === 'object')
      {
         if (this._filterNPMDocs(allDocs, managedData, global.$$esdoc_plugin_npm.packageData))
         {
            localDataFilter.push('node_modules');
         }
      }

      this._filterLocalDocs(allDocs, localData, localDataFilter);

      let lastDirPath = '.';

      //this._testLocalData(localData);
      //this._testManagedData(managedData);

      let groupCntr = 0;
      let folderCntr = 0;
      let packageCntr = 0;

      if (localData.length > 0)
      {
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

         iceNav.load('navData', iceNavLocal);
      }

      if (managedData.length > 0)
      {
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

         iceNav.load('navData', iceNavManaged);
      }

      return iceNav.html;
   }

   _createFolderData(checked, path, baseSCMLink, packageLink)
   {
      const folder =
      {
         checked,
         path,
         docs: []
      }

      if (packageLink) { folder.packageLink = packageLink; }
      if (baseSCMLink) { folder.scmLink = this._createSCMLink(baseSCMLink, path); }

      return folder;
   }

   _createPackageData(checked, baseSCMLink, packageLink)
   {
      const packageData =
      {
         checked,
         path,
         folders: []
      }

      if (packageLink) { folder.packageLink = packageLink; }
      if (baseSCMLink) { folder.scmLink = this._createSCMLink(baseSCMLink); }

      return packageData;
   }

   _createSCMLink(baseSCMLink, path, lineNumber)
   {
      const scmLink = {};

      switch (baseSCMLink.type)
      {
         case 'Github':
            scmLink.link = baseSCMLink.link;
            scmLink.type = baseSCMLink.type;

            // Add path and line number if available
            if (path) { scmLink.link += `tree/master/${path}`; }
            if (lineNumber) { scmLink.link += `#L${lineNumber}`; }
            break;

         default:
            console.log(`esdoc-plugin-enhanced-navigation - Warning: unsupported SCM type '${baseSCMLink.type}'.`);
            return undefined;
      }

      return scmLink;
   }

   _filterLocalDocs(allDocs, localData, localDataFilter)
   {
      // Filter local docs
      const localDocs = allDocs.filter((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');

         let localDoc = true;

         localDataFilter.forEach((filter) => { if (filePath.startsWith(filter)) { localDoc = false; } });

         return localDoc;
      });

      // Return early if there are no docs to process.
      if (localDocs.length === 0) { return false; }

      const localGroup =
      {
         checked: true,
         name: 'Local Source',
         folders: []
      };

      localData.push(localGroup);

      const baseRepoLink = this._getLocalRepoUrl();

      let currentFolder;

      // Set initial values
      {
         const filePath = localDocs[0].longname.split('~')[0].replace(/^.*?[/]/, '');
         currentFolder = this._createFolderData(true, path.dirname(filePath), baseRepoLink);
      }

      localDocs.forEach((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         const dirPath = path.dirname(filePath);
         const shortName = doc.longname.split('~')[1];
         const kind = doc.interface ? 'interface' : doc.kind;

         if (currentFolder.path !== dirPath)
         {
            localGroup.folders.push(currentFolder);
            currentFolder = this._createFolderData(true, dirPath, baseRepoLink);
         }

         currentFolder.docs.push(
         {
            type: `nav-kind-${kind}`,
            name: shortName,
            docLink: super._getURL(doc),
            scmLink: this._createSCMLink(baseRepoLink, filePath, doc.lineNumber)
         });

         //console.log('!! _filterLocalDocs - LOCAL docs --------------------------------------------');
         //console.log('!! _filterLocalDocs - filepath: ' + filePath);
         //console.log('!! _filterLocalDocs - dirPath: ' + dirPath);
         //console.log('!! _filterLocalDocs - shortName: ' + shortName);
         //console.log('!! _filterLocalDocs - kind: ' + kind);
         //console.log('!! _filterLocalDocs - super._getURL: ' + super._getURL(doc));
         //console.log('!! _filterLocalDocs - doc: ' + JSON.stringify(doc));
      });

      localGroup.folders.push(currentFolder);
   }

   _filterJSPMDocs(allDocs, managedData, packageData)
   {
      // Filter JSPM packages
      const jspmDocs = allDocs.filter((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         return filePath.startsWith('jspm_packages');
      });

      // Return early if there are no docs to process.
      if (jspmDocs.length === 0) { return false; }

      // Create relative path to package map

      const jspmGroup =
      {
         checked: false,
         name: 'JSPM Managed Source',
         packages: []
      };

      managedData.push(jspmGroup);

      let currentPackage, currentFolder;

      // Set initial values
      //{
      //   const filePath = localDocs[0].longname.split('~')[0].replace(/^.*?[/]/, '');
      //   currentFolder = this._createFolderData(true, path.dirname(filePath), baseRepoLink);
      //}

      jspmDocs.forEach((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         const dirPath = path.dirname(filePath);
         const shortName = doc.longname.split('~')[1];
         const kind = doc.interface ? 'interface' : doc.kind;

         //if (currentFolder.path !== dirPath)
         //{
         //   localGroup.folders.push(currentFolder);
         //   currentFolder = this._createFolderData(true, dirPath, baseRepoLink);
         //}

         //currentFolder.docs.push(
         //{
         //   type: `nav-kind-${kind}`,
         //   name: shortName,
         //   docLink: super._getURL(doc),
         //   scmLink: this._createSCMLink(baseRepoLink, filePath, doc.lineNumber)
         //});

         console.log('!! _filterJSPMDocs - JSPM docs ----------------------------------------------');
         console.log('!! _filterJSPMDocs - filepath: ' + filePath);
         console.log('!! _filterJSPMDocs - dirPath: ' + dirPath);
         console.log('!! _filterJSPMDocs - shortName: ' + shortName);
         console.log('!! _filterJSPMDocs - kind: ' + kind);
         console.log('!! _filterJSPMDocs - super._getURL: ' + super._getURL(doc));
         console.log('!! _filterJSPMDocs - doc: ' + JSON.stringify(doc));
      });

//      localGroup.folders.push(currentFolder);

      return true;
   }

   _filterNPMDocs(allDocs, managedData, packageData)
   {
      // Filter NPM packages
      const npmDocs = allDocs.filter((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         return filePath.startsWith('node_modules');
      });

      // Return early if there are no docs to process.
      if (npmDocs.length === 0) { return false; }

      npmDocs.forEach((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         const dirPath = path.dirname(filePath);
         const shortName = doc.longname.split('~')[1];
         const kind = doc.interface ? 'interface' : doc.kind;

         console.log('!! _filterNPMDocs NPM docs -----------------------------------------------');
         console.log('!! _filterNPMDocs - filepath: ' + filePath);
         console.log('!! _filterNPMDocs - dirPath: ' + dirPath);
         console.log('!! _filterNPMDocs - shortName: ' + shortName);
         console.log('!! _filterNPMDocs - kind: ' + kind);
      });

      return true;
   }

   /**
    * Parses the repo URL from `package.json` and determines repo type and base link. Currently only Github URLs
    * are supported.
    *
    * If no SCM match is available or repo URL is missing from `package.json` then `null` is returned otherwise
    * an object hash containing repo `type` and the base `link` are returned.
    *
    * @returns {null|{}}
    * @private
    */
   _getLocalRepoUrl()
   {
      const info = this._getInfo();

      if (info.url)
      {
         if (info.url.match(new RegExp('^https?://github.com/')))
         {
            // Remove `.git` for URL end and potentially add a forward slash if missing.
            let link = info.url.replace(/\.git$/, '');
            if (!link.endsWith('/')) { link += '/'; }

            return { link, type: 'Github' };
         }
      }

      return undefined;
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

   _testLocalData(localData)
   {
      localData.push(
       {
          checked: true,
          name: 'Local Source',
          folders:
           [
              {
                 checked: true,
                 path: 'src',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-interface', name: 'Interface', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-function', name: 'Function', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-variable', name: 'Variable', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-typedef', name: 'Typedef', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-external', name: 'External', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                  ]
              },
              {
                 checked: true,
                 path: 'src1',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-interface', name: 'Interface', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-function', name: 'Function', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-variable', name: 'Variable', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-typedef', name: 'Typedef', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-external', name: 'External', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                  ]
              },
              {
                 checked: true,
                 path: 'src2',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-interface', name: 'Interface', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-function', name: 'Function', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-variable', name: 'Variable', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-typedef', name: 'Typedef', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                     { type: 'nav-kind-external', name: 'External', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                  ]
              }
           ]
       });
   }

   _testManagedData(managedData)
   {
      managedData.push(
       {
          checked: false,
          name: 'JSPM Managed Source',
          packages:
           [
              {
                 checked: false,
                 name: 'jspm-package1',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     }
                  ]
              },
              {
                 checked: false,
                 name: 'jspm-package2',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     }
                  ]
              }
           ]
       });

      managedData.push(
       {
          checked: false,
          name: 'NPM Managed Source',
          packages:
           [
              {
                 checked: false,
                 name: 'npm-package1',
                 packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     }
                  ]
              },
              {
                 checked: false,
                 name: 'npm-package2',
                 packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                 scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'Github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'NPM' }, scmLink: { link: 'https://github.com/typhonrt', type: 'Github' } }
                         ]
                     }
                  ]
              }
           ]
       });
   }
}