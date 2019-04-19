define('Controls-demo/Decorators/WrapURLs/WrapURLs',
   [
      'Core/Control',
      'wml!Controls-demo/Decorators/WrapURLs/WrapURLs',

      'Controls/input',
      'Controls/decorator',
      'css!Controls-demo/Decorators/WrapURLs/WrapURLs'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _wrapText: null,

         _inputCompletedHandler: function(event, value) {
            this._wrapText = value;
         }
      });
   }
);