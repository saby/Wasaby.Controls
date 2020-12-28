define('Controls-demo/Decorators/Highlight/Highlight',
   [
      'UI/Base',
      'wml!Controls-demo/Decorators/Highlight/Highlight',

      'Controls/input',
      'Controls/decorator'
   ],
   function(Base, template) {

      'use strict';

      return Base.Control.extend({
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
