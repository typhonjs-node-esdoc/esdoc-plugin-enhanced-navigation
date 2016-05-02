'use strict';

import { assert } from 'chai';
import fs         from 'fs-extra';
import path       from 'path';

/**
 * A very basic test to verify that the navigation has been replaced for `./test/fixture/docs/index.html`.
 */
describe('PluginTest', () =>
{
   it('Navigation Replacement', () =>
   {
      const filePath = path.resolve(__dirname, `../fixture/docs/index.html`);
      const indexHTML = fs.readFileSync(filePath, 'utf-8');

      assert(indexHTML.includes('<input type="checkbox" name="group-0" id="group-0" checked><label for="group-0" class="nav-header">Local Source</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="group-1" id="group-1"><label for="group-1" class="nav-header">JSPM Managed Source</label>'));
      assert(indexHTML.includes('<input type="checkbox" name="folder-1" id="folder-1" checked><label for="folder-1" class="nav-dir-path" data-ice="dirPath" data-scm-link="https://github.com/typhonjs-backbone-parse/backbone-parse-es6/tree/master/src" data-scm-type="github">src</label>'));
   });
});