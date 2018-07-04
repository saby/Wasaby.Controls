define('Controls/Application/HeadDataContext', [
   'Core/DataContext',
   'Controls/Application/DepsCollector/DepsCollector',
   'Core/Deferred',
   'Core/cookie'
], function(DataContext, DepsCollector, Deferred, cookie) {

   var bundles, modDeps, contents;
   try {
      bundles = require('json!WS.Core/ext/requirejs/bundlesRoute');
      modDeps = require('json!resources/module-dependencies');
      contents = require('json!resources/contents');
   } catch (e) {

   } finally {
      bundles = bundles || {};
      modDeps = modDeps || {links: {}, nodes: {}};
      contents = contents || {};
   }

   return DataContext.extend({
      pushDepComponent: function(componentName) {
         this.depComponentsMap[componentName] = true;
      },
      addReceivedState: function(key, receivedState) {
         this.receivedStateArr[key] = receivedState;
      },
      pushWaiterDeferred: function(def) {
         var depsCollector = new DepsCollector(modDeps.links, modDeps.nodes, bundles);
         var self = this;
         this.waiterDef = def;
         this.waiterDef.addCallback(function() {
            var components = Object.keys(self.depComponentsMap);
            if (cookie.get('s3debug') !== 'true' && contents.buildMode !== 'debug') {
               var files = depsCollector.collectDependencies(components);
               self.jsLinks = files.js;
               self.cssLinks = files.css;
            } else {
               self.jsLinks = [];
               self.cssLinks = [];
            }

            self.defRender.callback({
               jsLinks: self.jsLinks || [],
               cssLinks: self.cssLinks || [],
               errorState: self.err,
               receivedStateArr: self.receivedStateArr
            });
         });
      },
      constructor: function(theme) {
         this.theme = theme;
         this.defRender = new Deferred();
         this.depComponentsMap = {};
         this.receivedStateArr = {};
      },
      waitAppContent: function() {
         return this.defRender;
      }
   });
});
