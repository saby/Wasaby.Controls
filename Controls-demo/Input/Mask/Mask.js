define('Controls-demo/Input/Mask/Mask',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Mask/Mask',
      'Controls/Input/Mask/Formatter',
      'Controls/Input/Mask',
      'css!Controls-demo/Input/Mask/Mask'
   ],
   function(Control, template, Formatter) {

      'use strict';

      var Mask = Control.extend({
         _template: template,

         _mask: '',

         _replacer: '',

         _value: '',

         _tooltip: '',

         _setValue: function() {
            var replacer = this._replacer;

            this._value = replacer ? this._mask.replace(/./g, function(s) {
               if (/[Lldx]/.test(s)) {
                  return replacer;
               } else {
                  return s;
               }
            }) : '';
         },

         _setConfig: function(e, mask, replacer) {
            this._mask = mask;
            this._replacer = replacer;

            this._setValue();
         }
      });

      return Mask;
   }
);