define('Controls/Application/HeadDataContext', [
   'Core/DataContext',
   'Core/Deferred',
   'Core/IoC'
], function(DataContext, Deferred) {

   return DataContext.extend({
      pushDepComponent: function(componentName) {
         this.depComponentsMap[componentName] = true;
      },
      pushWaiterDeferred: function(def) {
         var self = this;
         this.waiterDef = def;
         var modpacker = require('wsmodPacker');
         this.waiterDef.addCallback(function() {
            var components = Object.keys(self.depComponentsMap);
            modpacker.collectDependencies(components, this.theme || '', false, function(err, files) {
               if (err) {
                  self.err = err;
                  return;
               } else {
                  self.jsLinks = files.js;
                  self.cssLinks = files.css;
               }

               // self.defRender.callback({
               //    jsLinks: components,
               //    cssLinks: components,
               //    errorState: components + "  " + Array.isArray(components)
               // });
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
