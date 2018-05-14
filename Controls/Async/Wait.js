define('Controls/Async/Wait',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Async/Wait'
   ],

   /**
    *
    */
   function (Base, Deferred, template) {
      'use strict';

      var Page = Base.extend({
         _template: function () {
            var res = template.apply(this, arguments);
            var self = this;
            if (res.addCallback && !res.isReady()) {
               res.addCallback(function (result) {
                  self.waitDef.callback({});
                  return result;
               });
            } else {
               if (self.waitDef) {
                  self.waitDef.callback({});
               }
            }
            return res;
         },
         _beforeMount: function (options, context, recievedState) {
            var def = new Deferred();
            this.waitDef = def;
            if (typeof window === 'undefined') {
               context.headData.push(def);
            }

         }
      });
      return Page;
   }
);
