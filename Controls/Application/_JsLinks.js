define('Controls/Application/_JsLinks',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Application/_JsLinks',
      'Controls/Application/HeadDataContext'
   ],

   // Component for adding jsLinks into html. Waits for Application's content drawn,

   function(Base, Deferred, template, HeadDataContext) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMountLimited: function() {
            // https://online.sbis.ru/opendoc.html?guid=252155de-dc95-402c-967d-7565951d2061
            // This component awaits completion of building content of _Wait component
            // So we don't need timeout of async building in this component
            // Because we need to build depends list in any case
            // before returning html to client
            return this._beforeMount.apply(this, arguments);
         },
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
               self.cssLinks = res.cssLinks;
               self.receivedStateArr = res.receivedStateArr;
               innerDef.callback(true);
               return res;
            });
            return innerDef;
         },
         getCssNameForDefine: function(cssLink) {
            return cssLink.replace('/resources/', '').replace(/\.min\..*$/, '');
         },
         getDefines: function() {
            if (!this.cssLinks) {
               return;
            }
            var result = '';
            for (var i = 0; i < this.cssLinks.length; i++) {
               result += 'define("css!' + this.getCssNameForDefine(this.cssLinks[i]) + '", "");';
            }
            return result;
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
