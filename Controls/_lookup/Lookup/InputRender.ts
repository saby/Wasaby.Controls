import input = require('Controls/input');
import template = require('wml!Controls/_lookup/Lookup/InputRender/InputRender');


   var InputRenderLookup = input.Text.extend({
      _template: template,

      _getReadOnlyField: function() {
         return InputRenderLookup.superclass._getField.call(this);
      },

      _keyDownInput: function(event) {
         this._notify('keyDownInput', [event]);
      }
   });

   export = InputRenderLookup;

