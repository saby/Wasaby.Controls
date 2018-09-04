define('Controls/Application/_Head',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Application/_Head',
      'Controls/Application/HeadDataContext'
   ],
   function(Base, Deferred, template, HeadDataContext) {
      'use strict';

      //Component for <head> html-node

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(options, context, receivedState) {
            if (typeof window !== 'undefined') {
               return;
            }
            var def = context.headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            self.cssLinks = [];
            def.addCallback(function(res) {
               self.cssLinks = res.cssLinks;
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
            return  value.replace('.css', '') + '_' + theme + '.css';
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
