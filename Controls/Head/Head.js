define('Controls/Head/Head',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Head/Head',
      'Controls/Async/HeadDataContext'
   ],
   function (Base, Deferred, template, HeadDataContext) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(options, context, receivedState) {
            if (receivedState) {
               this.cssLinks = receivedState;
               return;
            }
            var def = context.headData.waitForAllAsync();
            var self = this;
            var innerDef = new Deferred();
            self.cssLinks = [];
            def.addCallback(function (res) {
               self.cssLinks = self.cssLinks.concat(res.cssLinks);
               innerDef.callback(self.cssLinks);
            });
            return innerDef;
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
