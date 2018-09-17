define('Controls/Application/_Wait',
   [
      'Core/Control',
      'Core/Deferred',
      'Controls/Application/HeadDataContext',
      'wml!Controls/Application/_Wait'
   ],

   function(Base, Deferred, HeadDataContext, template) {
      'use strict';

      var Page = Base.extend({
         _template: function() {
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
         },
         _beforeMount: function(options, context) {
            this.waitDef = new Deferred();
            context.headData.pushWaiterDeferred(this.waitDef);
            if (typeof window !== 'undefined') {
               this.waitDef.callback();
               this.waitDef = new Deferred();
            }
         }
      });
      Page.contextTypes = function() {
         return {
            headData: HeadDataContext
         };
      };
      return Page;
   }
);
