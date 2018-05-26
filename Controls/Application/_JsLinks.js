define('Controls/Application/_JsLinks',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Application/_JsLinks',
      'Controls/Application/HeadDataContext'
   ],

   // Component for adding jsLinks into html. Waits for Application's content drawn,

   function(Base, Deferred, template, HeadDataContext) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(options, context, receivedState) {
            if (typeof window !== 'undefined') {
               return;
            }
            var def = context.headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            self.jsLinks = [];
            def.addCallback(function onLoad(res) {
               self.jsLinks = res.jsLinks;
               self.cssLinks = [];
               for (var i = 0; i < res.cssLinks.length; i++) {
                  self.cssLinks.push(res.cssLinks[i].split(/.css$/)[0]);
               }
               innerDef.callback(true);
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
