/**
 * 000Init -- Bootstraps the testing process by generating the documentation. Any previous coverage
 * docs (./test/fixture/docs) and (./test/fixture/docs-allfiles) are deleted before docs are generated.
 */

import fs         from 'fs-extra';
import ESDoc      from '../../node_modules/esdoc/out/src/ESDoc.js';
import publisher  from '../../node_modules/esdoc/out/src/Publisher/publish.js';

// ESDoc config for default options.
const config =
{
   source: './test/fixture/src',
   destination: './test/fixture/docs',
   plugins:
   [
      { name: 'esdoc-plugin-jspm' },
      { name: './src/plugin.js' }
   ],

   manual: { changelog: ["./CHANGELOG.md"] }
};

// ESDoc config for `showAllFiles` option.
const configAllFiles =
{
   source: './test/fixture/src',
   destination: './test/fixture/docs-allfiles',
   plugins:
    [
       { name: 'esdoc-plugin-jspm' },
       { name: './src/plugin.js', option: { showAllFiles: true } }
    ],

   manual: { changelog: ["./CHANGELOG.md"] }
};

// Clear doc directories.
fs.emptyDirSync(config.destination);
fs.emptyDirSync(configAllFiles.destination);

// Generate docs.
ESDoc.generate(config, publisher);
ESDoc.generate(configAllFiles, publisher);