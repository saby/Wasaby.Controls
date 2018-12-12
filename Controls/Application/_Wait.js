define('Controls/Application/_Wait',
   [
      'Core/Control',
      'Core/Deferred',
      'View/Request',
      'wml!Controls/Application/_Wait'
   ],

   function(Base, Deferred, Request, template) {
      'use strict';

      var asyncTemplate = function() {
         var res = template.apply(this, arguments);
         var self = this;
         if (res.addCallback && !res.isReady() && !self.waitDef.isReady()) {
            res.addCallback(function(result) {
               self.waitDef.callback({});
               return result;
            });
         } else {
            if (self.waitDef && !self.waitDef.isReady()) {
               self.waitDef.callback({});
            }
         }
         return res;
      };
      asyncTemplate.stable = true;

      var Page = Base.extend({
         _template: asyncTemplate,
         _beforeMount: function() {
            this.waitDef = new Deferred();
            Request.getCurrent().getStorage('HeadData').pushWaiterDeferred(this.waitDef);
            if (typeof window !== 'undefined') {
               this.waitDef.callback();
               this.waitDef = new Deferred();
            }
         }
      });

      return Page;
   }
);
