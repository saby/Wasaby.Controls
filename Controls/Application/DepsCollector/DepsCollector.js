define('Controls/Application/DepsCollector/DepsCollector', [
   'Core/Deferred',
   'Core/cookie',
   'Core/core-extend'
], function(Deferred, cookie, coreExtend) {

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

   function fixLinkSlash(link) {
      if (link.indexOf('/') !== 0) {
         return '/' + link;
      } else {
         return link;
      }
   }


   /**
    * Checks if dependency is a part of any bundle and removes from allDeps
    * @param allDeps
    * @returns {{}} Object, that contains all bundles for pre-load
    */
   function getPackages(allDeps, modInfo, bundlesRoute) {
      var packages = {};
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var bundleName = bundlesRoute[key];
            if (bundleName) {
               delete allDeps[key];
               packages[fixLinkSlash(bundleName)] = DEPTYPES.BUNDLE;
            }
         }
      }

      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            if (modInfo[key]) {
               if (isJs(key) || isCss(key) || isTmpl(key)) {
                  packages[fixLinkSlash(modInfo[key].path)] = DEPTYPES.SINGLE;
               }
            }
         }
      }
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
            if (!allDeps[node]) { // If module can be pre-loaded BRANCH
               var nodeDeps = modDeps[node];
               allDeps[node] = true;
               recursiveWalker(allDeps, nodeDeps, modDeps);
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
      constructor: function(modDeps, modInfo, bundlesRoute) {
         this.modDeps = modDeps;
         this.modInfo = modInfo;
         this.bundlesRoute = bundlesRoute;
      },
      collectDependencies: function(deps) {
         var files = {js: [], css: []};
         var allDeps = {};
         recursiveWalker(allDeps, deps, this.modDeps);
         var packages = getPackages(allDeps, this.modInfo, this.bundlesRoute); // Find all bundles, and removes dependencies that are included in bundles
         for (var key in packages) {
            if (packages.hasOwnProperty(key)) {
               if (key.slice(key.length - 3, key.length) === 'css') {
                  files.css.push(key);
                  var corrJs = key.replace(/.css$/, '.js');
                  if (!packages[corrJs] && packages[key] === DEPTYPES.BUNDLE) {
                     files.js.push(corrJs);
                  }
               } else if (key.slice(key.length - 2, key.length) === 'js') {
                  files.js.push(key);
               } else if (key.slice(key.length - 4, key.length) === 'tmpl') {
                  files.js.push(key);
               }
            }
         }
         return files;
      }
   });

   return DepsCollector;
});
