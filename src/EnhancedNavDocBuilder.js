'use strict';

import fs         from 'fs-extra';
import path       from 'path';

import IceCap     from 'ice-cap';
import DocBuilder from 'esdoc/out/src/Publisher/Builder/DocBuilder.js';

// import TestData   from './TestData.js';

const s_KIND_ORDER = { 'class': 0, 'interface': 1, 'function': 2, 'variable': 3, 'typedef': 4, 'external': 5 };

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
      let scmLink = '';
      let scmType = '';

      if (folder.scmLink && folder.scmLink.link && folder.scmLink.type)
      {
         scmLink = ` data-scm-link=${folder.scmLink.link}`;
         scmType = ` data-scm-type=${folder.scmLink.type}`;
      }

      return `<input type="checkbox" name="folder-${cntr}" id="folder-${cntr}"${folder.checked ? ' checked' : ''}>`
       + `<label for="folder-${cntr}" class="nav-dir-path" data-ice="dirPath"`
        + `${scmLink}${scmType}>${folder.path}</label>`;
   }

   _buildGroupHTML(cntr, group)
   {
      return `<input type="checkbox" name="group-${cntr}" id="group-${cntr}"${group.checked ? ' checked' : ''}>`
       + `<label for="group-${cntr}" class="nav-header">${group.name}</label>`;
   }

   _buildPackageHTML(cntr, data)
   {
      let navPackage = 'nav-package';

      let packageLink = '';
      let packageType = '';
      let scmLink = '';
      let scmType = '';

      const isAlias = data.isAlias ? ' nav-is-alias' : '';

      const packageVersion = data.version ? ` data-package-version=${data.version}` : '';

      if (data.packageLink && data.packageLink.link && data.packageLink.type)
      {
         packageLink = ` data-package-link=${data.packageLink.link}`;
         packageType = ` data-package-type=${data.packageLink.type}`;

         // Set NPM class designation
         if (data.packageLink.type === 'npm') { navPackage = 'nav-package-npm'; }
      }

      if (data.scmLink && data.scmLink.link && data.scmLink.type)
      {
         scmLink = ` data-scm-link=${data.scmLink.link}`;
         scmType = ` data-scm-type=${data.scmLink.type}`;
      }

      return `<input type="checkbox" name="package-${cntr}" id="package-${cntr}"${data.checked ? ' checked' : ''}>`
       + `<label for="package-${cntr}" class="${navPackage}${isAlias}" data-ice="dirPath"`
        + `${packageLink}${packageType}${packageVersion}${scmLink}${scmType}>${data.name}</label>`;
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

      // Sort by directory and kind.
      allDocs.sort((a, b) =>
      {
         const filePathA = a.longname.split('~')[0];
         const filePathB = b.longname.split('~')[0];
         const dirPathA = path.dirname(filePathA);
         const dirPathB = path.dirname(filePathB);
         const shortNameA = a.longname.split('~')[1].toLocaleLowerCase();
         const shortNameB = b.longname.split('~')[1].toLocaleLowerCase();
         const kindA = a.interface ? 'interface' : a.kind;
         const kindB = b.interface ? 'interface' : b.kind;

         if (dirPathA === dirPathB)
         {
            if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
            else { return s_KIND_ORDER[kindA] > s_KIND_ORDER[kindB] ? 1 : -1; }
         }
         else
         {
            return dirPathA > dirPathB ? 1 : -1;
         }
      });

      const localData = [];
      const localDataFilter = [];
      const managedData = [];

      // Filter and process any JSPM docs.
      if (this._filterJSPMDocs(allDocs, managedData)) { localDataFilter.push('jspm_packages'); }

      // Filter and process any NPM docs. TODO
      // if (this._filterNPMDocs(allDocs, managedData)) { localDataFilter.push('node_modules'); }

      this._filterLocalDocs(allDocs, localData, localDataFilter);

      // TestData.populate(localData, managedData);

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

   _createFolderData(checked, dirPath, baseSCMLink, packageLink)
   {
      const folder =
      {
         checked,
         path: dirPath,
         docs: []
      };

      if (packageLink) { folder.packageLink = packageLink; }
      if (baseSCMLink) { folder.scmLink = this._createSCMLink(baseSCMLink, dirPath); }

      return folder;
   }

   _createPackageFolderData(checked, dirPath, packageData)
   {
      const packagePath = dirPath.replace(`${packageData.relativePath}${path.sep}`, '');

      const folder = this._createFolderData(checked, packagePath, packageData.scmLink, packageData.packageLink);

      folder.originalDirPath = dirPath;

      return folder;
   }

   _createPackageData(checked, data)
   {
      const packageData =
      {
         checked,
         folders: [],
         isAlias: data.isAlias,
         name: data.isAlias ? `${data.packageName} (${data.actualPackageName})` : data.packageName,
         packageName: data.packageName,
         packageData: data,
         version: data.version
      };

      if (data.packageLink) { packageData.packageLink = data.packageLink; }
      if (data.scmLink) { packageData.scmLink = data.scmLink; }

      return packageData;
   }

   _createSCMLink(baseSCMLink, path, lineNumber)
   {
      const scmLink = {};

      switch (baseSCMLink.type)
      {
         case 'github':
            scmLink.link = baseSCMLink.link;
            scmLink.type = baseSCMLink.type;

            // Add path separator if link doesn't end with one currently.
            if (!scmLink.link.endsWith('/')) { scmLink.link += '/'; }

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
      });

      localGroup.folders.push(currentFolder);
   }

   _filterJSPMDocs(allDocs, managedData)
   {
      // Filter all docs that have JSPM package data attached
      const jspmDocs = allDocs.filter((doc) => { return doc.packageManager && doc.packageManager === 'jspm'; });

      // Return early if there are no docs to process.
      if (jspmDocs.length === 0) { return false; }

      // Sort by JSPM package name (potentially aliased), short file name and kind.
      jspmDocs.sort((a, b) =>
      {
         const packageDataA = a.packageData;
         const packageDataB = b.packageData;
         const packageNameA = packageDataA.packageName;
         const packageNameB = packageDataB.packageName;
         const shortNameA = a.longname.split('~')[1];
         const shortNameB = b.longname.split('~')[1];
         const kindA = a.interface ? 'interface' : a.kind;
         const kindB = b.interface ? 'interface' : b.kind;

         if (packageNameA === packageNameB)
         {
            if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
            else { return s_KIND_ORDER[kindA] > s_KIND_ORDER[kindB] ? 1 : -1; }
         }
         else
         {
            return packageNameA > packageNameB ? 1 : -1;
         }
      });

      const jspmGroup =
      {
         checked: false,
         name: 'JSPM Managed Source',
         packages: []
      };

      managedData.push(jspmGroup);

      let currentFolder, currentPackage;

      // Set initial values
      {
         currentPackage = this._createPackageData(false, jspmDocs[0].packageData);

         const filePath = jspmDocs[0].longname.split('~')[0].replace(/^.*?[/]/, '');
         currentFolder = this._createPackageFolderData(false, path.dirname(filePath), currentPackage.packageData);
      }

      jspmDocs.forEach((doc) =>
      {
         const jspmPackageData = doc.packageData;
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         const dirPath = path.dirname(filePath);
         const shortName = doc.longname.split('~')[1];
         const kind = doc.interface ? 'interface' : doc.kind;

         if (currentPackage.packageName !== jspmPackageData.packageName)
         {
            currentPackage.folders.push(currentFolder);

            // If a package only has one folder then set that folders checked value to true.
            if (currentPackage.folders.length === 1) { currentPackage.folders[0].checked = true; }

            jspmGroup.packages.push(currentPackage);

            currentPackage = this._createPackageData(false, jspmPackageData);
            currentFolder = this._createPackageFolderData(false, path.dirname(filePath), currentPackage.packageData);
         }
         else
         {
            if (currentFolder.originalDirPath !== dirPath)
            {
               currentPackage.folders.push(currentFolder);
               currentFolder = this._createPackageFolderData(false, path.dirname(filePath), currentPackage.packageData);
            }
         }

         const packageFilePath = filePath.replace(`${currentPackage.packageData.relativePath}${path.sep}`, '');

         currentFolder.docs.push(
         {
            type: `nav-kind-${kind}`,
            name: shortName,
            docLink: super._getURL(doc),
            scmLink: this._createSCMLink(currentPackage.scmLink, packageFilePath, doc.lineNumber)
         });
      });

      currentPackage.folders.push(currentFolder);

      // If a package only has one folder then set that folders checked value to true.
      if (currentPackage.folders.length === 1) { currentPackage.folders[0].checked = true; }

      jspmGroup.packages.push(currentPackage);

      return true;
   }

/* TODO
   _filterNPMDocs(allDocs, managedData)
   {
      // Filter all docs that have NPM package data attached
      const npmDocs = allDocs.filter((doc) => { return doc.packageManager && doc.packageManager === 'npm'; });

      // Return early if there are no docs to process.
      if (npmDocs.length === 0) { return false; }

      npmDocs.forEach((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         const dirPath = path.dirname(filePath);
         const shortName = doc.longname.split('~')[1];
         const kind = doc.interface ? 'interface' : doc.kind;

         console.log('!! _filterNPMDocs NPM docs -----------------------------------------------');
         console.log(`!! _filterNPMDocs - filepath: ${filePath}`);
         console.log(`!! _filterNPMDocs - dirPath: ${dirPath}`);
         console.log(`!! _filterNPMDocs - shortName: ${shortName}`);
         console.log(`!! _filterNPMDocs - kind: ${kind}`);
         console.log(`!! _filterNPMDocs - super._getURL: ${super._getURL(doc)}`);
         console.log(`!! _filterNPMDocs - doc: ${JSON.stringify(doc)}`);
      });

      return true;
   }
*/

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

            return { link, type: 'github' };
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
}