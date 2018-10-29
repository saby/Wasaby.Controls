define('Controls/Application/DepsCollector/DepsCollector', [
   'View/Logger',
   'Core/core-extend'
], function(Logger, coreExtend) {
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

   function isThemedCss(key) {
      return !!~key.indexOf('theme?');
   }

   function parseModuleName(name) {
      var typeInfo = getType(name);
      if (typeInfo === null) {
         Logger.log('Wrong type. Can not process module.', [name]);
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

   function getPackagesNames(allDeps, bundlesRoute) {
      var packages = {};
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var bundleName = bundlesRoute[key];
            if (bundleName) {
               Logger.log('Custom packets logs', ['Module ' + key + ' in bundle ' + bundleName]);
               delete allDeps[key];
               packages[getPackageName(bundleName)] = DEPTYPES.BUNDLE;
            }
         }
      }
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            if (allDeps[key].typeInfo.plugin) {
               packages[key.split(allDeps[key].typeInfo.plugin + '!')[1]] = DEPTYPES.SINGLE;
            } else {
               packages[key] = DEPTYPES.SINGLE;
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
            var bundleName = bundlesRoute[key];
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
            if (isThemedCss(key)) {
               packages.themedCss[key.split('theme?')[1]] = DEPTYPES.SINGLE;
            } else {
               packages.simpleCss[key.split('css!')[1]] = DEPTYPES.SINGLE;
            }
         }
      }
      return packages;
   }

   function getAllPackagesNames(allDeps, bundlesRoute, themesActive) {
      var packages = {
         js: {},
         css: {}
      };
      packages.js = getPackagesNames(allDeps.js, bundlesRoute);
      packages.css = getCssPackages(allDeps.css, bundlesRoute, themesActive);
      packages.tmpl = getPackagesNames(allDeps.tmpl, bundlesRoute);
      packages.wml = getPackagesNames(allDeps.wml, bundlesRoute);
      return packages;
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
                  return;
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
      constructor: function(modDeps, modInfo, bundlesRoute, themesActive) {
         this.modDeps = modDeps;
         this.modInfo = modInfo;
         this.bundlesRoute = bundlesRoute;
         this.themesActive = themesActive;
      },
      collectDependencies: function(deps) {
         var files = {
            js: [], css: {themedCss: [], simpleCss: []}, tmpl: [], wml: []
         };
         var allDeps = {};
         recursiveWalker(allDeps, deps, this.modDeps, this.modInfo);
         var packages = getAllPackagesNames(allDeps, this.bundlesRoute, this.themesActive); // Find all bundles, and removes dependencies that are included in bundles
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
      }
   });

   return DepsCollector;
});
