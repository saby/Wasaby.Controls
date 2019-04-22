define('Controls/Application/DepsCollector/DepsCollector', [
   'View/Logger',
   'Env/Env',
   'Core/core-extend',
   'Core/i18n'
], function(Logger, Env, coreExtend, i18n) {
   var DEPTYPES = {
      BUNDLE: 1,
      SINGLE: 2
   };
   var TYPES = {
      tmpl: {
         type: 'tmpl',
         plugin: 'tmpl',
         hasDeps: true,
         hasPacket: false,
         canBePackedInParent: true
      },
      js: {
         type: 'js',
         plugin: '',
         hasDeps: true,
         hasPacket: true,
         packOwnDeps: true
      },
      wml: {
         type: 'wml',
         plugin: 'wml',
         hasDeps: true,
         hasPacket: false,
         canBePackedInParent: true
      },
      css: {
         type: 'css',
         plugin: 'css',
         hasDeps: false,
         hasPacket: true
      },
      default: {
         hasDeps: false
      }
   };

   function getPlugin(name) {
      var res;
      res = name.split('!')[0];
      if (res === name) {
         res = '';
      }
      return res;
   }

   function getType(name) {
      var plugin = getPlugin(name);
      for (var key in TYPES) {
         if (TYPES[key].plugin === plugin) {
            return TYPES[key];
         }
      }
      return null;
   }

   function getPackageName(packageLink) {
      return packageLink.replace(/^(\/resources\/|resources\/)+/, '').replace(/\.min\.(css|js)$/, '');
   }

   function getExt(fileName) {
      var res = fileName.match(/\.\w+$/);
      if (res && res.length) {
         return res[0].slice(1);
      }
      Env.IoC.resolve('ILogger').error('Incorrect extension: ' + fileName);
      return '';
   }

   function isThemedCss(key) {
      return !!~key.indexOf('theme?');
   }

   function removeThemeParam(name) {
      return name.replace('theme?', '');
   }


   function parseModuleName(name) {
      var typeInfo = getType(name);
      if (typeInfo === null) {
         // TODO Change to error after https://online.sbis.ru/opendoc.html?guid=5de9d9bd-be4a-483a-bece-b41983e916e4
         Logger.log('Wrong type', ['Can not process module: ' + name]);
         return null;
      }
      var nameWithoutPlugin;
      if (typeInfo.plugin) {
         nameWithoutPlugin = name.split(typeInfo.plugin + '!')[1];
      } else {
         nameWithoutPlugin = name;
      }
      return {
         moduleName: nameWithoutPlugin,
         fullName: name,
         typeInfo: typeInfo
      };
   }

   function getEmptyPackages() {
      var packages = {};
      for (var key in TYPES) {
         if (TYPES.hasOwnProperty(key)) {
            packages[key] = {};
         }
      }
      return packages;
   }

   function getPackagesNames(allDeps, bundlesRoute) {
      var packages = getEmptyPackages();
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var bundleName = bundlesRoute[key];
            if (bundleName) {
               Logger.log('Custom packets logs', ['Module ' + key + ' in bundle ' + bundleName]);
               delete allDeps[key];
               var ext = getExt(bundleName);
               packages[ext][getPackageName(bundleName)] = DEPTYPES.BUNDLE;
            }
         }
      }
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var ext = allDeps[key].typeInfo.type;
            if (allDeps[key].typeInfo.plugin) {
               packages[ext][key.split(allDeps[key].typeInfo.plugin + '!')[1]] = DEPTYPES.SINGLE;
            } else {
               packages[ext][key] = DEPTYPES.SINGLE;
            }
         }
      }
      return packages;
   }

   function getCssPackages(allDeps, bundlesRoute, themesActive) {
      var packages = {
         themedCss: {},
         simpleCss: {}
      };
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var noParamsName = removeThemeParam(key);
            var bundleName = bundlesRoute[noParamsName];
            if (bundleName) {
               Logger.log('Custom packets logs', ['Module ' + key + ' in bundle ' + bundleName]);
               delete allDeps[key];
               if (isThemedCss(key) && themesActive) {
                  packages.themedCss[getPackageName(bundleName)] = DEPTYPES.BUNDLE;
               } else {
                  packages.simpleCss[getPackageName(bundleName)] = DEPTYPES.BUNDLE;
               }
            }
         }
      }
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var noParamsName = removeThemeParam(key).split('css!')[1];
            if (isThemedCss(key)) {
               packages.themedCss[noParamsName] = DEPTYPES.SINGLE;
            } else {
               packages.simpleCss[noParamsName] = DEPTYPES.SINGLE;
            }
         }
      }
      return packages;
   }

   function getAllPackagesNames(allDeps, bundlesRoute, themesActive) {
      var packages = getEmptyPackages();
      mergePackages(packages, getPackagesNames(allDeps.js, bundlesRoute));
      mergePackages(packages, getPackagesNames(allDeps.tmpl, bundlesRoute));
      mergePackages(packages, getPackagesNames(allDeps.wml, bundlesRoute));

      packages.css = getCssPackages(allDeps.css, bundlesRoute, themesActive);
      return packages;
   }

   function mergePackages(result, addedPackages) {
      for (var addedPackage in addedPackages) {
         if (addedPackages.hasOwnProperty(addedPackage)) {
            if (result[addedPackage] === undefined) {
               result[addedPackage] = {};
            }
            for (var key in addedPackages[addedPackage]) {
               if (addedPackages[addedPackage].hasOwnProperty(key)) {
                  result[addedPackage][key] = addedPackages[addedPackage][key];
               }
            }
         }
      }
   }

   /**
    * Create object which contains all nodes of dependency tree.
    * { js: {}, css: {}, ..., wml: {} }
    * @param allDeps
    * @param curNodeDeps
    * @param modDeps
    */
   function recursiveWalker(allDeps, curNodeDeps, modDeps, modInfo, skipDep) {
      if (curNodeDeps && curNodeDeps.length) {
         for (var i = 0; i < curNodeDeps.length; i++) {
            var node = curNodeDeps[i];
            var splitted = node.split('!');
            if (splitted[0] === 'optional' && splitted.length > 1) { // OPTIONAL BRANCH
               splitted.shift();
               node = splitted.join('!');
               if (!modInfo[node]) {
                  continue;
               }
            }
            var module = parseModuleName(node);
            if (module) {
               var moduleType = module.typeInfo.type;
               if (!allDeps[moduleType]) {
                  allDeps[moduleType] = {};
               }
               if (!allDeps[moduleType][node]) {
                  if (!(skipDep && !!module.typeInfo.canBePackedInParent)) {
                     allDeps[moduleType][module.fullName] = module;
                  }
                  if (module.typeInfo.hasDeps) {
                     var nodeDeps = modDeps[node];
                     recursiveWalker(allDeps, nodeDeps, modDeps, modInfo, !!module.typeInfo.packOwnDeps);
                  }
               }
            }
         }
      }
   }

   var DepsCollector = coreExtend.extend([], {

      /**
       * @param modDeps - object, contains all nodes of dependency tree
       * @param modInfo - contains info about path to module files
       * @param bundlesRoute - contains info about custom packets with modules
       */
      constructor: function(modDeps, modInfo, bundlesRoute, themesActive, needLocalisation) {
         this.modDeps = modDeps;
         this.modInfo = modInfo;
         this.bundlesRoute = bundlesRoute;
         this.themesActive = themesActive;
         this.localizationEnabled = needLocalisation;
      },
      collectDependencies: function(deps) {
         var files = {
            js: [], css: {themedCss: [], simpleCss: []}, tmpl: [], wml: [],
            cssToDefine: []
         };
         var allDeps = {};
         recursiveWalker(allDeps, deps, this.modDeps, this.modInfo);
         if (allDeps.css) {
            for (var key in allDeps.css) {
               files.cssToDefine.push(key);
            }
         }
         var packages = getAllPackagesNames(allDeps, this.bundlesRoute, this.themesActive); // Find all bundles, and removes dependencies that are included in bundles

         // Collect dictionaries
         if (this.localizationEnabled) {
            var collectedDictList = {};
            var module;
            var moduleLang;
            var lang = this.getLang();
            var availableDictList = this.getAvailableDictList(lang);
            for (var key in packages.js) {
               module = key.split('/')[0];
               moduleLang = module + '/lang/' + lang + '/' + lang + '.json';
               if (availableDictList[moduleLang]) {
                  collectedDictList[moduleLang] = true;
               }
            }
            for (var key in collectedDictList) {
               if (collectedDictList.hasOwnProperty(key)) {
                  files.js.push(key);
               }
            }
         }

         for (var key in packages.js) {
            if (packages.js.hasOwnProperty(key)) {
               files.js.push(key);
            }
         }
         for (var key in packages.tmpl) {
            if (packages.tmpl.hasOwnProperty(key)) {
               files.tmpl.push(key);
            }
         }
         for (var key in packages.wml) {
            if (packages.wml.hasOwnProperty(key)) {
               files.wml.push(key);
            }
         }
         for (var key in packages.css.themedCss) {
            if (packages.css.themedCss.hasOwnProperty(key)) {
               if (!packages.js[key] && packages.css.themedCss[key] === DEPTYPES.BUNDLE) {
                  files.js.push(key);
               }
               files.css.themedCss.push(key);
            }
         }
         for (var key in packages.css.simpleCss) {
            if (packages.css.simpleCss.hasOwnProperty(key)) {
               if (!packages.js[key] && packages.css.simpleCss[key] === DEPTYPES.BUNDLE) {
                  files.js.push(key);
               }
               files.css.simpleCss.push(key);
            }
         }
         return files;
      },
      getLang: function() {
         return i18n.getLang();
      },
      getAvailableDictList: function(lang) {
         return i18n._dictNames[lang] || {};
      }
   });

   return DepsCollector;
});
