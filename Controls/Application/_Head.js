define('Controls/Application/_Head',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Application/_Head',
      'Controls/Application/HeadDataContext',
      'Core/Themes/ThemesController'
   ],
   function(Base, Deferred, template, HeadDataContext, ThemesController) {
      'use strict';

      //Component for <head> html-node

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(options, context, receivedState) {
            if (typeof window !== 'undefined' && !window.themesActive) {
               return;
            }
            var def = context.headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            self.cssLinks = [];
            def.addCallback(function(res) {
               var csses = ThemesController.getInstance().getCss();
               self.themedCss = csses.themedCss;
               self.simpleCss = csses.simpleCss;
               self.errorState = res.errorState;
               innerDef.callback(true);
               return res;
            });
            return innerDef;
         },
         isArrayHead: function() {
            return Array.isArray(this._options.head);
         },
         isMultiThemes: function() {
            return Array.isArray(this._options.theme);
         },
         getCssWithTheme: function(value, theme) {
            return  value.replace(/(.min.css$|.css$)/g, '') + '_' + theme + '.css';
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
