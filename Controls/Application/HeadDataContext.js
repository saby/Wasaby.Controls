define('Controls/Application/HeadDataContext', [
   'Core/DataContext',
   'Core/Deferred',
], function(DataContext, Deferred) {
   var bundles;
   try {
      bundles = require('json!WS.Core/ext/requirejs/bundles');
   } catch (e) {
      bundles = {};
   }

   var modDeps;
   try {
      modDeps = require('json!resources/module-dependencies');
   } catch (e) {
      modDeps = { links: {}, nodes: {} };
   }

   /**
    * Checks if bundle has any css
    * @param bundle
    * @returns {boolean}
    */
   function hasCss(bundle) {
      if (!Array.isArray(bundle)) {
         return false;
      }
      for (var i = 0; i < bundle.length; i++) {
         if (~bundle[i].indexOf('css!')) {
            return true;
         }
      }
      return false;
   }

   /**
    * Gets css-bundles
    * @param jsLinks
    * @returns {{}}
    */
   function getDependentCss(jsLinks) {
      function cropBundleName(s) {
         if (s.indexOf('.min')) {
            var cropped = s.split('.min')[0];
         } else {
            cropped = s;
         }
         if (cropped.indexOf('/') === 0) {
            cropped = cropped.slice(1);
         }
         return cropped;
      }

      var dependCssLinks = {};
      var bundleNames = Object.keys(bundles);
      var croppedBundleNames = [];
      for (var i = 0; i < bundleNames.length; i++) {
         croppedBundleNames.push(cropBundleName(bundleNames[i]));
      }
      for (var key in jsLinks) {
         if (jsLinks.hasOwnProperty(key)) {
            var croppedJsLink = cropBundleName(key);
            var needLoadCssBundle = false;
            var bundleIdx = croppedBundleNames.indexOf(croppedJsLink);
            if (bundleIdx !== -1) {
               var name = bundleNames[bundleIdx];
               if (hasCss(bundles[name])) {
                  needLoadCssBundle = true;
               }
            }
            if (needLoadCssBundle) {
               var jsLinkNoExtension = key.split('.js')[0];
               dependCssLinks[jsLinkNoExtension] = true;
            }
         }
      }
      return dependCssLinks;
   }

   /**
    * Checks if dependency is a part of any bundle and remove from allDeps
    * @param allDeps
    * @returns {{}} Object, that contains all necessary bundles
    */
   function checkForBundles(allDeps) {
      function removeAllFromObject(obj, els) {
         for (var i = 0; i < els.length; i++) {
            delete obj[els[i]];
         }
      }
      function findBundle(str) {
         for (var key in bundles) {
            if (~bundles[key].indexOf(str)) {
               return key;
            }
         }
         return null;
      }
      var jsBundles = {};
      for (var key in allDeps) {
         if (allDeps.hasOwnProperty(key)) {
            var bundleName = findBundle(key);
            if (bundleName) {
               removeAllFromObject(allDeps, bundles[bundleName]);
               jsBundles[bundleName] = true;
            }
         }
      }
      return jsBundles;
   }

   function fixLink(link, type) {
      if (type === 'css') {
         if (link.indexOf('css!') === 0) {
            link = link.split('css!')[1];
         }
         link += '.css';
      } else {
         link += '.js';
      }
      if (link.indexOf('resources/') !== 0) {
         link = 'resources/' + link;
      }
      return link;
   }

   function collectDependencies(deps, callback) {
      function recursiveWalker(allDeps, curNodeDeps) {
         if (curNodeDeps && curNodeDeps.length) {
            for (var i = 0; i < curNodeDeps.length; i++) {
               var node = curNodeDeps[i];
               if (!allDeps[node]) {
                  var nodeDeps = modDeps.links[node];
                  allDeps[node] = true;
                  recursiveWalker(allDeps, nodeDeps);
               }
            }
         }
      }

      var allDeps = {};
      recursiveWalker(allDeps, deps);
      var jsBundles = checkForBundles(allDeps); // Find all bundles, and removes dependencies that are included in bundles
      var cssBundles = getDependentCss(jsBundles);
      var files = { js: [], css: [] };
      for (var key in jsBundles) {
         if (jsBundles.hasOwnProperty(key)) {
            files.js.push(fixLink(key, 'js'));
         }
      }
      for (var key in cssBundles) {
         if (cssBundles.hasOwnProperty(key)) {
            files.css.push(fixLink(key, 'css'));
         }
      }
      for (var key in allDeps) {
         if (key.indexOf('css!') === 0) {
            files.css.push(fixLink(key, 'css'));
         } else if (key.indexOf('tmpl!') !== 0) {
            files.js.push(fixLink(key, 'js'));
         }
      }
      return callback(undefined, files);
   }

   return DataContext.extend({
      pushDepComponent: function(componentName) {
         this.depComponentsMap[componentName] = true;
      },
      pushWaiterDeferred: function(def) {
         var self = this;
         this.waiterDef = def;
         this.waiterDef.addCallback(function() {
            var components = Object.keys(self.depComponentsMap);
            collectDependencies(components, function(err, files) {
               if (err) {
                  self.err = err;
                  return;
               } else {
                  self.jsLinks = files.js;
                  self.cssLinks = files.css;
               }

               self.defRender.callback({
                  jsLinks: self.jsLinks || [],
                  cssLinks: self.cssLinks || [],
                  errorState: self.err
               });
            });
         });
      },
      constructor: function(theme) {
         this.theme = theme;
         this.defRender = new Deferred();
         this.depComponentsMap = {};
      },
      waitAppContent: function() {
         return this.defRender;
      }
   });
});
