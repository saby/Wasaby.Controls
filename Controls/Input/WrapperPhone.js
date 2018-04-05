define('Controls/Input/WrapperPhone',
   [
      'Core/Control',
      'tmpl!Controls/Input/WrapperPhone',

      'Controls/Input/Phone'
   ],
   function(Control, template) {

   'use strict';

   var WrapperPhone = Control.extend({
      _template: template,

      getSrcText: function() {
         return this._options.srcText
      },

      setSrcText: function() {
         this._srcText
      }
   })
   }
);