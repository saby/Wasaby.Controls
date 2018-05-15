define('Controls/Application/_Head',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Application/_Head',
      'Controls/Application/HeadDataContext'
   ],
   function(Base, Deferred, template, HeadDataContext) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(options, context, receivedState) {
            if (receivedState) {
               this.cssLinks = receivedState;
               return;
            }
            var def = context.headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            self.cssLinks = options.cssLinks || [];
            def.addCallback(function(res) {
               self.cssLinks = self.cssLinks.concat(res.cssLinks);
               self.errorState = res.errorState;
               innerDef.callback(self.cssLinks);
               return res;
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
