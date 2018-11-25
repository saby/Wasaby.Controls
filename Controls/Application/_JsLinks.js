define('Controls/Application/_JsLinks',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Application/_JsLinks',
      'View/Request'
   ],

   // Component for adding jsLinks into html. Waits for Application's content drawn,

   function(Base, Deferred, template, Request) {
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
         _beforeMount: function() {
            if (typeof window !== 'undefined') {
               return;
            }
            var headData = Request.getCurrent().getStorage('HeadData');
            var def = headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            def.addCallback(function onLoad(res) {
               self.js = res.js;
               self.tmpl = res.tmpl;
               self.wml = res.wml;
               self.themedCss = res.css.themedCss;
               self.simpleCss = res.css.simpleCss;
               self.receivedStateArr = res.receivedStateArr;
               innerDef.callback(true);
               return res;
            });
            return innerDef;
         },
         getCssNameForDefineWithTheme: function(cssLink) {
            return 'theme?' + cssLink;
         },
         getDefines: function() {
            var result = '';
            if (this.themedCss && this.simpleCss) {
               var i;
               for (i = 0; i < this.simpleCss.length; i++) {
                  result += 'define("css!' + this.simpleCss[i] + '", "");';
               }
               for (i = 0; i < this.themedCss.length; i++) {
                  result += 'define("css!' + this.getCssNameForDefineWithTheme(this.themedCss[i]) + '", "");';
               }
            }

            return result;
         }

      });

      return Page;
   }
);
