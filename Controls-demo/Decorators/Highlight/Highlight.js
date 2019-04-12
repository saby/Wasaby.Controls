define('Controls-demo/Decorators/Highlight/Highlight',
   [
      'Core/Control',
      'wml!Controls-demo/Decorators/Highlight/Highlight',

      'Controls/input',
      'Controls/decorator',
      'css!Controls-demo/Decorators/Highlight/Highlight'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _wrapText: null,

         _highlightText: null,

         _highlightInputCompletedHandler: function(event, value) {
            this._highlightText = value;
         },

         _wrapInputCompletedHandler: function(event, value) {
            this._wrapText = value;
         }
      });
   }
);