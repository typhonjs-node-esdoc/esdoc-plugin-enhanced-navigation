'use strict';

import fs         from 'fs-extra';
import path       from 'path';

import IceCap     from 'ice-cap';
import DocBuilder from 'esdoc/out/src/Publisher/Builder/DocBuilder.js';

const s_KIND_ORDER = { 'class': 0, 'interface': 1, 'function': 2, 'variable': 3, 'typedef': 4, 'external': 5 };

/**
 * Enhanced Navigation Output Builder class.
 */
export default class EnhancedNavDocBuilder extends DocBuilder
{
   /**
    * Create instance.
    *
    * @param {object} data - Taffy / doc object database.
    * @param {object} config - ESDoc config is used build output.
    * @param {object} options - Sanitized plugin options.
    */
   constructor(data, config, options)
   {
      super(data, config);

      this.options = options;
   }

   /**
    * Creates the HTML for template insertion for a doc / tag link.
    *
    * @param {object}   doc - An object hash describing the doc / tag link.
    * @returns {*}
    * @private
    */
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

   /**
    * Builds the file HTML to fill the IceCap template.
    *
    * If the file has an entry `hidden` that is true the file will be hidden. This is useful when all files in a
    * directory have a single default export which doesn't clash with any other export and each export matches
    * the file name. All TyphonJS repos for instance have a strict naming policy to only provide a single default
    * export which matches the file name.
    *
    * @param {number}   cntr - File counter.
    * @param {object}   file - File data.
    *
    * @returns {*}
    * @private
    */
   _buildFileHTML(cntr, file)
   {
      let scmLink = '';
      let scmType = '';

      if (file.scmLink && file.scmLink.link && file.scmLink.type)
      {
         scmLink = ` data-scm-link=${file.scmLink.link}`;
         scmType = ` data-scm-type=${file.scmLink.type}`;
      }

      return `<input type="checkbox" name="file-${cntr}" id="file-${cntr}"${file.checked ? ' checked' : ''}>`
       + `<label for="file-${cntr}" class="nav-file${file.hidden ? ' hidden' : ''}"`
        + `${scmLink}${scmType}>${file.name}</label>`;
   }

   /**
    * Creates the HTML for template insertion for a source folder.
    *
    * @param {number}   cntr - Total running count of folders to create unique ID.
    * @param {object}   folder - An object hash describing the folder.
    *
    * @returns {*}
    * @private
    */
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
       + `<label for="folder-${cntr}" class="nav-dir-path"`
        + `${scmLink}${scmType}>${folder.path}</label>`;
   }

   /**
    * Creates the HTML for template insertion for a source group (local, JSPM, NPM, etc.).
    *
    * @param {number}   cntr - Total running count of source groups to create unique ID.
    * @param {object}   group - An object hash describing the source group.
    *
    * @returns {*}
    * @private
    */
   _buildGroupHTML(cntr, group)
   {
      return `<input type="checkbox" name="group-${cntr}" id="group-${cntr}"${group.checked ? ' checked' : ''}>`
       + `<label for="group-${cntr}" class="nav-header">${group.name}</label>`;
   }

   /**
    * Creates the HTML for template insertion for a managed package (JSPM, NPM, etc.).
    *
    * @param {number}   cntr - Total running count of source groups to create unique ID.
    * @param {object}   data - An object hash describing the package.
    *
    * @returns {*}
    * @private
    */
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
       + `<label for="package-${cntr}" class="${navPackage}${isAlias}"`
        + `${packageLink}${packageType}${packageVersion}${scmLink}${scmType}>${data.name}</label>`;
   }

   /**
    * Build navigation output.
    *
    * @return {string} HTML navigation output.
    */
   buildNavDoc()
   {
      const iceNav = new IceCap(this._readTemplate('nav.html'));
      const iceNavLocal = new IceCap(this._readTemplate('nav-local.html'));
      const iceNavManaged = new IceCap(this._readTemplate('nav-managed.html'));

      const kinds = ['class', 'function', 'variable', 'typedef', 'external'];
      const allDocs = this._find({ kind: kinds }).filter((v) => !v.builtinExternal);

      const dirPathNonDefaultMap = {};

      // Add more data for each doc.
      allDocs.forEach((doc) =>
      {
         const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/, '');
         const dirPath = path.dirname(filePath);
         const fileName = path.basename(filePath);
         const shortName = doc.longname.split('~')[1];
         const kind = doc.interface ? 'interface' : doc.kind;

         const exportMatchesFileName = path.parse(filePath).name === shortName;

         // If the short name doesn't match the the name of the file then designate the directory as containing
         // non-default exports.
         if (!exportMatchesFileName) { dirPathNonDefaultMap[dirPath] = true; }

         doc.__navData = { dirPath, exportMatchesFileName, fileName, filePath, kind, shortName };
      });

      // Potentially take a second pass through all docs to set fileHidden based on whether there are only default
      // exports that match the shortName and fileName without extension. In the case when there is one export that
      // matches the file name then the associated file is hidden.
      if (!this.options.showAllFiles)
      {
         allDocs.forEach((doc) =>
         {
            doc.__navData.fileHidden = !(typeof dirPathNonDefaultMap[doc.__navData.dirPath] === 'boolean');
         });
      }

      const localData = [];
      const localDataFilter = [];
      const managedData = [];

      // Filter and process any JSPM docs.
      if (this._filterJSPMDocs(allDocs, managedData)) { localDataFilter.push('jspm_packages'); }

      // Filter and process any NPM docs. TODO
      // if (this._filterNPMDocs(allDocs, managedData)) { localDataFilter.push('node_modules'); }

      this._filterLocalDocs(allDocs, localData, localDataFilter);

      let groupCntr = 0;
      let folderCntr = 0;
      let fileCntr = 0;
      let packageCntr = 0;

      // If there is local data then loop through the Icecap template `nav-local.html` filling in data.
      if (localData.length > 0)
      {
         iceNavLocal.loop('navGroup', localData, (cntr, group, ice) =>
         {
            ice.loop('navFolder', group.folders, (cntr, folder, ice) =>
            {
               ice.loop('navFile', folder.files, (cntr, file, ice) =>
               {
                  ice.loop('doc', file.docs, (cntr, doc, ice) =>
                  {
                     ice.attr('doc', 'class', doc.type);
                     ice.load('docLink', this._buildDocLinkHTML(doc));
                  });

                  ice.load('navFile', this._buildFileHTML(fileCntr++, file), IceCap.MODE_PREPEND);
               });

               ice.load('navFolder', this._buildFolderHTML(folderCntr++, folder), IceCap.MODE_PREPEND);
            });

            ice.load('navGroup', this._buildGroupHTML(groupCntr++, group), IceCap.MODE_PREPEND);
         });

         iceNav.load('navData', iceNavLocal);
      }

      // If there is managed data then loop through the Icecap template `nav-managed.html` filling in data.
      if (managedData.length > 0)
      {
         iceNavManaged.loop('navGroup', managedData, (cntr, group, ice) =>
         {
            ice.loop('navPackage', group.packages, (cntr, packageData, ice) =>
            {
               ice.loop('navFolder', packageData.folders, (cntr, folder, ice) =>
               {
                  ice.loop('navFile', folder.files, (cntr, file, ice) =>
                  {
                     ice.loop('doc', file.docs, (cntr, doc, ice) =>
                     {
                        ice.attr('doc', 'class', doc.type);
                        ice.load('docLink', this._buildDocLinkHTML(doc));
                     });

                     ice.load('navFile', this._buildFileHTML(fileCntr++, file), IceCap.MODE_PREPEND);
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

   /**
    * Creates the data object representing a file that may contain docs / tags.
    *
    * @param {boolean}  checked - Indicates if the accordion menu input item is checked / open.
    * @param {string}   filePath - File path for the file.
    * @param {string}   fileName - File name for the file.
    * @param {string}   baseSCMLink - (Optional) If provided will create the SCM link for the file.
    * @param {string}   packageLink - (Optional) If provided will create the package manager link for the file.
    *
    * @returns {object}
    * @private
    */
   _createFileData(checked, filePath, fileName, baseSCMLink, packageLink)
   {
      const file =
      {
         checked,
         name: fileName,
         path: filePath,
         docs: []
      };

      if (packageLink) { file.packageLink = packageLink; }
      if (baseSCMLink) { file.scmLink = this._createSCMLink(baseSCMLink, filePath); }

      return file;
   }

   /**
    * Creates the data object representing a folder that may contain files.
    *
    * @param {boolean}  checked - Indicates if the accordion menu input item is checked / open.
    * @param {string}   dirPath - Directory path for the source folder.
    * @param {string}   baseSCMLink - (Optional) If provided will create the SCM link for the folder.
    * @param {string}   packageLink - (Optional) If provided will create the package manager link for the folder.
    *
    * @returns {object}
    * @private
    */
   _createFolderData(checked, dirPath, baseSCMLink, packageLink)
   {
      const folder =
      {
         checked,
         path: dirPath,
         files: []
      };

      if (packageLink) { folder.packageLink = packageLink; }
      if (baseSCMLink) { folder.scmLink = this._createSCMLink(baseSCMLink, dirPath); }

      return folder;
   }

   /**
    * Creates the data object representing a managed package file that may contain docs / tags. Before deferring to
    * `_createFileData` the local relative path for the file path is replaced.
    *
    * @param {boolean}  checked - Indicates if the accordion menu input item is checked / open.
    * @param {string}   filePath - File path for the file.
    * @param {string}   fileName - File name for the file.
    * @param {object}   packageData - Associated managed package data.
    *
    * @returns {object}
    * @private
    */
   _createPackageFileData(checked, filePath, fileName, packageData)
   {
      const packagePath = filePath.replace(`${packageData.relativePath}${path.sep}`, '');

      const file = this._createFileData(checked, packagePath, fileName, packageData.scmLink);

      file.originalFilePath = filePath;

      return file;
   }

   /**
    * Creates the data object representing a folder for a managed package that may contain files.
    *
    * @param {boolean}  checked - Indicates if the accordion menu input item is checked / open.
    * @param {string}   dirPath - Directory path for the source folder.
    * @param {object}   packageData - Associated managed package data.
    *
    * @returns {object}
    * @private
    */
   _createPackageFolderData(checked, dirPath, packageData)
   {
      const packagePath = dirPath.replace(`${packageData.relativePath}${path.sep}`, '');

      const folder = this._createFolderData(checked, packagePath, packageData.scmLink, packageData.packageLink);

      folder.originalDirPath = dirPath;

      return folder;
   }

   /**
    * Creates the data object representing a managed package that may contain folders.
    *
    * @param {boolean}  checked - Indicates if the accordion menu input item is checked / open.
    * @param {object}   data - Associated managed package data.
    *
    * @returns {object}
    * @private
    */
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

   /**
    * Creates a link to a source code management system given a base link, path and potentially a line number.
    * Currently only Github is supported, but other SCM systems can be added upon request.
    *
    * @param {string}   baseSCMLink - The base SCM link for a given repository.
    * @param {string}   path - Path of folder or file to add to base SCM link.
    * @param {number}   lineNumber - Line number for the doc / tag being linked.
    *
    * @returns {*}
    * @private
    */
   _createSCMLink(baseSCMLink, path, lineNumber)
   {
      const scmLink = {};

      if (baseSCMLink && baseSCMLink.type)
      {
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
      }

      return scmLink;
   }

   /**
    * Filters all local source docs and adds created data to `localData`. An array `localDataFilter` may contain
    * any relative path strings which are filtered out; examples include `jspm_packages` for JSPM managed packages or
    * `node_modules` for NPM managed packages which are separated from local source.
    *
    * @param {Array} allDocs - All docs / tags to parse.
    * @param {Array} localData - Local data array to populate with local source.
    * @param {Array} localDataFilter - An array of string prefixes to exclude docs from local source.
    *
    * @returns {boolean} - If any docs are processed then true is returned.
    * @private
    */
   _filterLocalDocs(allDocs, localData, localDataFilter)
   {
      // Filter local docs
      const localDocs = allDocs.filter((doc) =>
      {
         const filePath = doc.__navData.filePath;

         let localDoc = true;

         localDataFilter.forEach((filter) => { if (filePath.startsWith(filter)) { localDoc = false; } });

         return localDoc;
      });

      // Return early if there are no docs to process.
      if (localDocs.length === 0) { return false; }

      // Sort by directory / file name / kind.
      this._sortDocs(localDocs);

      // Create local source group.
      const localGroup =
      {
         checked: true,
         name: 'Local Source',
         folders: []
      };

      localData.push(localGroup);

      const baseRepoLink = this._getLocalRepoUrl();

      let currentFile, currentFolder;

      // Set initial values for first file / folder.
      {
         const data = localDocs[0].__navData;
         currentFile = this._createFileData(true, data.filePath, data.fileName, baseRepoLink);
         currentFile.hidden = data.fileHidden;
         currentFolder = this._createFolderData(true, data.dirPath, baseRepoLink);
      }

      // Process all local docs associating data for group / folder / file / doc.
      localDocs.forEach((doc) =>
      {
         const data = doc.__navData;
         const fileHidden = data.fileHidden;
         const fileName = data.fileName;
         const filePath = data.filePath;
         const dirPath = data.dirPath;
         const shortName = data.shortName;
         const kind = data.kind;

         // If the file name or path differs then create a new current file after pushing the old one to the current
         // folder.
         if (currentFile.name !== fileName || currentFile.path !== filePath)
         {
            currentFolder.files.push(currentFile);
            currentFile = this._createFileData(true, filePath, fileName, baseRepoLink);
            currentFile.hidden = fileHidden;
         }

         // If the current folder path differs then create a new folder after pushing the old one ot the local group.
         if (currentFolder.path !== dirPath)
         {
            localGroup.folders.push(currentFolder);
            currentFolder = this._createFolderData(true, dirPath, baseRepoLink);
         }

         // Push the doc / tag to the current file.
         currentFile.docs.push(
         {
            type: `nav-kind-${kind}`,
            name: shortName,
            docLink: super._getURL(doc),
            scmLink: this._createSCMLink(baseRepoLink, filePath, doc.lineNumber)
         });
      });

      // Final push of last file / folder.
      currentFolder.files.push(currentFile);
      localGroup.folders.push(currentFolder);

      return true;
   }

   /**
    * Filters all docs that are JSPM managed and adds created data to `managedData`. The `esdoc-plugin-jspm` plugin
    * adds to all docs / tags associated JSPM package data. Below this data is detected and if so the doc / tag is
    * processed as JSPM managed.
    *
    * @param {Array} allDocs - All docs / tags to parse.
    * @param {Array} managedData - Managed data array to populate with JSPM sources.
    *
    * @returns {boolean} - If any docs are processed then true is returned.
    * @private
    */
   _filterJSPMDocs(allDocs, managedData)
   {
      // Filter all docs that have JSPM package data attached
      const jspmDocs = allDocs.filter((doc) => { return doc.packageManager && doc.packageManager === 'jspm'; });

      // Return early if there are no docs to process.
      if (jspmDocs.length === 0) { return false; }

      // Sort all package docs by package / folder / file name (if not hidden) / tag & kind.
      this._sortPackageDocs(jspmDocs);

      const jspmGroup =
      {
         checked: false,
         name: 'JSPM Managed Source',
         packages: []
      };

      managedData.push(jspmGroup);

      let currentFile, currentFolder, currentPackage;

      // Set initial values
      {
         currentPackage = this._createPackageData(false, jspmDocs[0].packageData);

         const data = jspmDocs[0].__navData;

         currentFile = this._createPackageFileData(true, data.filePath, data.fileName, currentPackage.packageData);
         currentFile.hidden = data.fileHidden;
         currentFolder = this._createPackageFolderData(true, data.dirPath, currentPackage.packageData);
      }

      // Process all JSPM docs associating data for group / package / folder / file / doc.
      jspmDocs.forEach((doc) =>
      {
         const jspmPackageData = doc.packageData;

         const data = doc.__navData;
         const fileHidden = data.fileHidden;
         const fileName = data.fileName;
         const filePath = data.filePath;
         const dirPath = data.dirPath;
         const shortName = data.shortName;
         const kind = data.kind;

         // If the file name or path differs then create a new current file after pushing the old one to the current
         // folder.
         if (currentFile.name !== fileName || currentFile.originalFilePath !== filePath)
         {
            currentFolder.files.push(currentFile);
            currentFile = this._createPackageFileData(true, filePath, fileName, jspmPackageData);
            currentFile.hidden = fileHidden;
         }

         // If the associated package name differs then create a new current package after pushing the old one to
         // the JSPM group.
         if (currentPackage.packageName !== jspmPackageData.packageName)
         {
            currentPackage.folders.push(currentFolder);

            // If a package only has one folder then set that folders checked value to true.
            if (currentPackage.folders.length === 1) { currentPackage.folders[0].checked = true; }

            jspmGroup.packages.push(currentPackage);

            currentPackage = this._createPackageData(false, jspmPackageData);
            currentFolder = this._createPackageFolderData(false, dirPath, currentPackage.packageData);
         }
         else
         {
            // Process the next folder in the current package.
            if (currentFolder.originalDirPath !== dirPath)
            {
               currentPackage.folders.push(currentFolder);
               currentFolder = this._createPackageFolderData(false, filePath, currentPackage.packageData);
            }
         }

         const packageFilePath = filePath.replace(`${currentPackage.packageData.relativePath}${path.sep}`, '');

         // Push the doc / tag to the current file.
         currentFile.docs.push(
         {
            type: `nav-kind-${kind}`,
            name: shortName,
            docLink: super._getURL(doc),
            scmLink: this._createSCMLink(currentPackage.scmLink, packageFilePath, doc.lineNumber)
         });
      });

      // Final push of last file / folder / package.
      currentFolder.files.push(currentFile);
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
    * If no SCM match is available or repo URL is missing from `package.json` then `undefined` is returned otherwise
    * an object hash containing repo `type` and the base `link` are returned.
    *
    * @returns {undefined|{}}
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

   /**
    * Sort by directory / file name / doc short name / kind. If `fileHidden` is true for both docs then the file is
    * not used in sorting as the source folder has all default exports which match the file name.
    *
    * @param {Array}    docs - The ESDoc docs / tags to sort.
    *
    * @private
    */
   _sortDocs(docs)
   {
      docs.sort((a, b) =>
      {
         const dirPathA = a.__navData.dirPath.toLocaleLowerCase();
         const dirPathB = b.__navData.dirPath.toLocaleLowerCase();
         const fileNameA = a.__navData.fileName.toLocaleLowerCase();
         const fileNameB = b.__navData.fileName.toLocaleLowerCase();
         const shortNameA = a.__navData.shortName.toLocaleLowerCase();
         const shortNameB = b.__navData.shortName.toLocaleLowerCase();
         const kindA = a.__navData.kind;
         const kindB = b.__navData.kind;

         const filesHidden = a.__navData.fileHidden && b.__navData.fileHidden;

         if (dirPathA === dirPathB)
         {
            // Only sort by short name and kind.
            if (filesHidden)
            {
               if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
               else { return s_KIND_ORDER[kindA] > s_KIND_ORDER[kindB] ? 1 : -1; }
            }
            else // Full sort with file name, short name and kind.
            {
               if (fileNameA === fileNameB)
               {
                  if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
                  else { return s_KIND_ORDER[kindA] > s_KIND_ORDER[kindB] ? 1 : -1; }
               }
               else
               {
                  return fileNameA > fileNameB ? 1 : -1;
               }
            }
         }
         else
         {
            return dirPathA > dirPathB ? 1 : -1;
         }
      });
   }

   /**
    * Sort by package name / directory / file name / doc short name / kind. If `fileHidden` is true for both docs then
    * the file is not used in sorting as the source folder has all default exports which match the file name.
    *
    * @param {Array}    docs - The ESDoc docs / tags to sort.
    *
    * @private
    */
   _sortPackageDocs(docs)
   {
      // Sort by JSPM package name (potentially aliased), directory path, file name, doc name and kind.
      docs.sort((a, b) =>
      {
         const packageDataA = a.packageData;
         const packageDataB = b.packageData;
         const packageNameA = packageDataA.packageName;
         const packageNameB = packageDataB.packageName;
         const dirPathA = a.__navData.dirPath.toLocaleLowerCase();
         const dirPathB = b.__navData.dirPath.toLocaleLowerCase();
         const fileNameA = a.__navData.fileName.toLocaleLowerCase();
         const fileNameB = b.__navData.fileName.toLocaleLowerCase();
         const shortNameA = a.__navData.shortName.toLocaleLowerCase();
         const shortNameB = b.__navData.shortName.toLocaleLowerCase();
         const kindA = a.__navData.kind;
         const kindB = b.__navData.kind;

         const filesHidden = a.__navData.fileHidden && b.__navData.fileHidden;

         if (packageNameA === packageNameB)
         {
            if (dirPathA === dirPathB)
            {
               // Only sort by short name and kind.
               if (filesHidden)
               {
                  if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
                  else { return s_KIND_ORDER[kindA] > s_KIND_ORDER[kindB] ? 1 : -1; }
               }
               else // Full sort with file name, short name and kind.
               {
                  if (fileNameA === fileNameB)
                  {
                     if (kindA === kindB) { return shortNameA > shortNameB ? 1 : -1; }
                     else { return s_KIND_ORDER[kindA] > s_KIND_ORDER[kindB] ? 1 : -1; }
                  }
                  else
                  {
                     return fileNameA > fileNameB ? 1 : -1;
                  }
               }
            }
            else
            {
               return dirPathA > dirPathB ? 1 : -1;
            }
         }
         else
         {
            return packageNameA > packageNameB ? 1 : -1;
         }
      });
   }
}