define('Controls/Application/HeadDataContext', [
   'Core/DataContext',
   'Controls/Application/DepsCollector/DepsCollector',
   'Core/Deferred',
   'Core/cookie',
   'View/Runner/common',
   'Core/Serializer'

], function(DataContext, DepsCollector, Deferred, cookie, common, Serializer) {

   function getDepsFromSerializer(slr) {
      var moduleInfo;
      var deps = {};
      var modules = slr._linksStorage;
      for (var key in modules) {
         if (modules.hasOwnProperty(key)) {
            moduleInfo = modules[key];
            if (moduleInfo.module) {
               deps[moduleInfo.module] = true;
            }
         }
      }
      return deps;
   }


   var bundles, modDeps, contents;
   try{
      modDeps = require('json!resources/module-dependencies');
   }catch (e) {

   }
   try{
      contents = require('json!resources/contents');
   }catch (e) {

   }
   try {
      bundles = require('json!WS.Core/ext/requirejs/bundlesRoute');
   } catch (e) {

   }

   bundles = bundles || {};
   modDeps = modDeps || {links: {}, nodes: {}};
   contents = contents || {};

   return DataContext.extend({
      _version: 0,
      needObjects: true,
      pushDepComponent: function(componentName, needRequire) {
         this.depComponentsMap[componentName] = true;
         if (needRequire) {
            this.additionalDeps[componentName] = true;
         }
      },
      serializeReceivedStates: function() {
         var slr;
         var serializedMap = {};
         var allAdditionalDeps = {};
         var allRecStates = this.receivedStateObjectsArray;
         for (var key in allRecStates) {
            slr = new Serializer();
            var receivedState = allRecStates[key];
            var serializedState = JSON.stringify(receivedState, slr.serialize);
            common.componentOptsReArray.forEach(function(re) {
               serializedState = serializedState.replace(re.toFind, re.toReplace);
            });
            serializedMap[key] = serializedState;
            var addDeps = getDepsFromSerializer(slr);
            for (var dep in addDeps) {
               if (addDeps.hasOwnProperty(dep)) {
                  allAdditionalDeps[dep] = true;
               }
            }
         }
         return {
            serializedMap: serializedMap,
            additionalDepsMap: allAdditionalDeps
         };
      },
      addReceivedState: function(key, receivedState) {
         this.receivedStateObjectsArray[key] = receivedState;
      },
      pushWaiterDeferred: function(def) {
         var self = this;
         var depsCollector = new DepsCollector(modDeps.links, modDeps.nodes, bundles, self.buildNumber);
         self.waiterDef = def;
         self.waiterDef.addCallback(function() {
            var rcsData = self.serializeReceivedStates();
            for (var key in rcsData.additionalDepsMap) {
               if (rcsData.additionalDepsMap.hasOwnProperty(key)) {
                  self.depComponentsMap[key] = true;
               }
            }
            var components = Object.keys(self.depComponentsMap);
            if (cookie.get('s3debug') !== 'true' && contents.buildMode !== 'debug') {
               var files = depsCollector.collectDependencies(components);
               self.jsLinks = files.js;
               self.cssLinks = self.cssLinks ? self.cssLinks.concat(files.css) : files.css;
            } else {
               self.jsLinks = [];
               self.cssLinks = self.cssLinks || [];
            }
            self._version++;
            self.defRender.callback({
               jsLinks: self.jsLinks || [],
               cssLinks: self.cssLinks || [],
               errorState: self.err,
               receivedStateArr: rcsData.serializedMap,
               additionalDeps: Object.keys(rcsData.additionalDepsMap).concat(Object.keys(self.additionalDeps))

            });
         });
      },
      constructor: function(theme, buildNumber, cssLinks) {
         this.theme = theme;
         this.defRender = new Deferred();
         this.depComponentsMap = {};
         this.receivedStateObjectsArray = {};
         this.receivedStateArr = {};
         this.additionalDeps = {};
         this.buildNumber = buildNumber;
         this.cssLinks = cssLinks;
      },
      pushCssLink: function(url) {
         this.cssLinks.push(url);
         this._version++;
      },
      getVersion: function() {
         return this._version;
      },
      waitAppContent: function() {
         return this.defRender;
      }
   });
});
