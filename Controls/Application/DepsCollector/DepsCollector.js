define('Controls/Application/DepsCollector/DepsCollector', [
   'View/Logger',
   'Core/core-extend'
], function(Logger, coreExtend) {
   var DEPTYPES = {
      BUNDLE: 1,
      SINGLE: 2
   };

   function isJs(key) {
      return key.split('!')[0] === key;
   }

   function isCss(key) {
      var keySplitted = key.split('!');
      return keySplitted[0] === 'css' && keySplitted.length > 1;
   }

   function isTmpl(key) {
      var keySplitted = key.split('!');
      return keySplitted[0] === 'tmpl' && keySplitted.length > 1;
   }

   function isWml(key) {
      var keySplitted = key.split('!');
      return keySplitted[0] === 'wml' && keySplitted.length > 1;
   }

   function getPackageName(packageLink) {

      return packageLink.replace(/^(\/resources\/|resources\/)+/g, '').replace(/\.min\.(css|js|tmpl)$/, '');
   }

   function isThemedCss(key) {
      return !!~key.indexOf('theme?');
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
            packages[key] = DEPTYPES.SINGLE;
         }
      }
      return packages;
   }

   function getCssPackages(allDeps, bundlesRoute) {
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
               if (isThemedCss(key)) {
                  packages.themedCss[bundleName.split('theme?')[1]] = DEPTYPES.BUNDLE;
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
               packages.simpleCss[getPackageName(key)] = DEPTYPES.SINGLE;
            }
         }
      }
      return packages;
   }

   function getAllPackagesNames(allDeps, bundlesRoute) {
      var packages = {
         js: {},
         css: {},
         tmpl: {}
      };
      packages.js = getPackagesNames(allDeps.js, bundlesRoute);
      packages.tmpl = getPackagesNames(allDeps.tmpl, bundlesRoute);
      packages.css = getCssPackages(allDeps.css, bundlesRoute);
      return packages;
   }

   function recursiveWalker(allDeps, curNodeDeps, modDeps) {
      if (curNodeDeps && curNodeDeps.length) {
         for (var i = 0; i < curNodeDeps.length; i++) {
            var node = curNodeDeps[i];
            var splitted = node.split('!');
            if (splitted[0] === 'optional' && splitted.length > 1) { // OPTIONAL BRANCH
               splitted.shift();
               node = splitted.join('!');
            }
            var nodeDeps = modDeps[node];
            if (isTmpl(node) && !allDeps.tmpl[node]) {// TODO Надо вынести в отдельную функцию. Здесь работать независимо от плагина
               allDeps.tmpl[node.split('tmpl!')[1]] = true;
               recursiveWalker(allDeps, nodeDeps, modDeps);
            } else if (isJs(node) && !allDeps.js[node]) {
               allDeps.js[node] = true;
               recursiveWalker(allDeps, nodeDeps, modDeps);
            } else if (isWml(node) && !allDeps.wml[node]) {
               allDeps.wml[node.split('wml!')[1]] = true;
               recursiveWalker(allDeps, nodeDeps, modDeps);
            } else if (isCss(node) && !allDeps.css[node]) {
               allDeps.css[node.split('css!')[1]] = true;
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
      constructor: function(modDeps, modInfo, bundlesRoute, buildNumber, appRoot) {
         this.modDeps = modDeps;
         this.modInfo = modInfo;
         this.bundlesRoute = bundlesRoute;
         this.buildNumber = buildNumber;
         this.appRoot = appRoot;
      },
      collectDependencies: function(deps) {
         var files = {js: [], css: {themedCss: [], simpleCss: []}, tmpl: []};
         var allDeps = {js: {}, css: {}, tmpl: {}, wml: {}};
         recursiveWalker(allDeps, deps, this.modDeps);
         var packages = getAllPackagesNames(allDeps, this.bundlesRoute); // Find all bundles, and removes dependencies that are included in bundles
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
