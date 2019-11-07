import input = require('Controls/input');
import template = require('wml!Controls/_lookup/BaseLookupView/InputRender/InputRender');


   var InputRenderLookup = input.Text.extend({
      _template: template,

      _getField: function() {
         if (this._options.isInputVisible) {
            return InputRenderLookup.superclass._getField.call(this);
         } else {
            // Это необходимо для правильной работы базового InputRender, он ожидает что поле ввода всегда есть в верстке
            return document.createElement('input');
         }
      },

      _getReadOnlyField: function() {
         return this._getField();
      },

      _keyDownInput: function(event) {
         this._notify('keyDownInput', [event]);
      }
   });

   export = InputRenderLookup;

