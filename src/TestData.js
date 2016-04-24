export default class TestData
{
   static populate(localData, managedData)
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
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-interface', name: 'Interface', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-function', name: 'Function', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-variable', name: 'Variable', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-typedef', name: 'Typedef', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-external', name: 'External', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                  ]
              },
              {
                 checked: true,
                 path: 'src1',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-interface', name: 'Interface', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-function', name: 'Function', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-variable', name: 'Variable', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-typedef', name: 'Typedef', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-external', name: 'External', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                  ]
              },
              {
                 checked: true,
                 path: 'src2',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 docs:
                  [
                     { type: 'nav-kind-class', name: 'Class', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-interface', name: 'Interface', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-function', name: 'Function', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-variable', name: 'Variable', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-typedef', name: 'Typedef', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                     { type: 'nav-kind-external', name: 'External', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                  ]
              }
           ]
       });

      // Managed test data ------------------------------------------------------------------------------------------------

      managedData.push(
       {
          checked: false,
          name: 'JSPM Managed Source',
          packages:
           [
              {
                 checked: false,
                 name: 'jspm-package1',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     }
                  ]
              },
              {
                 checked: false,
                 name: 'jspm-package2',
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'jspm-src',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src1',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'jspm-src2',
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'JSPMClass', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'JSPMInterface', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'JSPMFunction', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'JSPMVariable', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'JSPMTypedef', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'JSPMExternal', docLink: 'https://google.com', scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
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
                 packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     }
                  ]
              },
              {
                 checked: false,
                 name: 'npm-package2',
                 packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                 scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                 folders:
                  [
                     {
                        checked: false,
                        path: 'npm-src',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src1',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     },
                     {
                        checked: false,
                        path: 'npm-src2',
                        packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' },
                        scmLink: { link: 'https://github.com/typhonrt', type: 'github' },
                        docs:
                         [
                            { type: 'nav-kind-class', name: 'NPMClass', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-interface', name: 'NPMInterface', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-function', name: 'NPMFunction', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-variable', name: 'NPMVariable', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-typedef', name: 'NPMTypedef', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } },
                            { type: 'nav-kind-external', name: 'NPMExternal', docLink: 'https://google.com', packageLink: { link: 'https://www.npmjs.com/package/esdoc-plugin-jspm', type: 'npm' }, scmLink: { link: 'https://github.com/typhonrt', type: 'github' } }
                         ]
                     }
                  ]
              }
           ]
       });
   }
}