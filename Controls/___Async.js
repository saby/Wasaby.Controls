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
         _beforeMount: function(options, context) {
            if (typeof window !== 'undefined') {
               var def = new Deferred();
               require([options.templateName], function() {
                  def.callback();
               });
               return def;
            }
            this.waitDef = new Deferred();
            context.headData.pushDepComponent(options.templateName);
            require(options.templateName);
         }
      });
      return Page;
   }
);
