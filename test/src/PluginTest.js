'use strict';

import { assert } from 'chai';
import fs         from 'fs-extra';
import path       from 'path';

/**
 * A very basic test to verify that the navigation has been replaced for `./test/fixture/docs/index.html` and
 * `./test/fixture/docs-allfiles/index.html`.
 */
describe('PluginTest', () =>
{
   it('Navigation Replacement', () =>
   {
      const filePath = path.resolve(__dirname, `../fixture/docs/index.html`);
      const indexHTML = fs.readFileSync(filePath, 'utf-8');

      assert(indexHTML.includes('<input type="checkbox" name="group-0" id="group-0" checked><label for="group-0" class="nav-header">Local Source</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="folder-0" id="folder-0" checked><label for="folder-0" class="nav-dir-path" data-scm-link="https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/tree/master/test/fixture/src/default" data-scm-type="github">test/fixture/src/default</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="file-0" id="file-0" checked><label for="file-0" class="nav-file hidden" data-scm-link="https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/tree/master/test/fixture/src/default" data-scm-type="github">TestDefaultClass.js</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="group-1" id="group-1"><label for="group-1" class="nav-header">JSPM Managed Source</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="package-0" id="package-0"><label for="package-0" class="nav-package nav-is-alias" data-package-version="master" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6" data-scm-type="github">backbone (backbone-parse-es6)</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="folder-3" id="folder-3" checked><label for="folder-3" class="nav-dir-path" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6/tree/master/src" data-scm-type="github">src</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="file-10" id="file-10" checked><label for="file-10" class="nav-file hidden" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6/tree/master/src/BackboneParseObject.js" data-scm-type="github">BackboneParseObject.js</label>'));
   });

   it('Navigation Replacement (Show all files)', () =>
   {
      const filePath = path.resolve(__dirname, `../fixture/docs-allfiles/index.html`);
      const indexHTML = fs.readFileSync(filePath, 'utf-8');

      assert(indexHTML.includes('<input type="checkbox" name="group-0" id="group-0" checked><label for="group-0" class="nav-header">Local Source</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="folder-0" id="folder-0" checked><label for="folder-0" class="nav-dir-path" data-scm-link="https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/tree/master/test/fixture/src/default" data-scm-type="github">test/fixture/src/default</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="file-0" id="file-0" checked><label for="file-0" class="nav-file" data-scm-link="https://github.com/typhonjs-node-esdoc/esdoc-plugin-enhanced-navigation/tree/master/test/fixture/src/default" data-scm-type="github">TestDefaultClass.js</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="group-1" id="group-1"><label for="group-1" class="nav-header">JSPM Managed Source</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="package-0" id="package-0"><label for="package-0" class="nav-package nav-is-alias" data-package-version="master" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6" data-scm-type="github">backbone (backbone-parse-es6)</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="folder-3" id="folder-3" checked><label for="folder-3" class="nav-dir-path" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6/tree/master/src" data-scm-type="github">src</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="file-10" id="file-10" checked><label for="file-10" class="nav-file" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6/tree/master/src/BackboneParseObject.js" data-scm-type="github">BackboneParseObject.js</label>'));
   });
});