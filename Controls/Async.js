define('Controls/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Async/Async'
   ],

   /**
    *
    */
   function(Base, Deferred, template) {
      'use strict';

      var Page = Base.extend({
         _template: function() {
            var res = template.apply(this, arguments);
            var self = this;
            if (res.addCallback && !res.isReady()) {
               if (self.waitDef) {
                  res.addCallback(function(result) {
                     self.waitDef.callback(self.deps);
                     return result;
                  });
               }
            } else {
               if (self.waitDef) {
                  self.waitDef.callback(self.deps);
               }
            }
            return res;
         },
         stateError: false,
         _beforeMount: function(options, context) {
            var def = new Deferred();
            var defRender = new Deferred();
            var self = this;
            var loadModules = options.loadModules;
            if (typeof loadModules === 'string') {
               loadModules = [loadModules];
            }
            if (typeof window !== 'undefined') {
               require(loadModules, function() {
                  def.callback(true);
               }, function(e) {
                  self.stateError = JSON.stringify(e);
                  def.callback(false);
               });
               return def;
            } else {
               try {
                  this.waitDef = def;
                  require(options.loadModules);
                  var modpacker = require('wsmodPacker');
                  modpacker.collectDependencies(loadModules, options.theme, false, function(err, files) {
                     if (err) {
                        self.stateError = JSON.stringify(err);
                        defRender.callback(false);
                     } else {
                        self.deps = {
                           jsLinks: files.js,
                           cssLinks: files.css
                        };
                        defRender.callback(true);
                     }
                  });
               } catch (e) {
                  self.stateError = JSON.stringify(e);
                  defRender.callback(false);
               }
               context.headData.push(def);
               return defRender;
            }
         }
      });
      return Page;
   }
);
