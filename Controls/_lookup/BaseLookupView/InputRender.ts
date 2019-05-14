import input = require('Controls/input');
import template = require('wml!Controls/_lookup/BaseLookupView/InputRender/InputRender');


   var InputRenderLookup = input.Text.extend({
      _template: template,

      _getField: function() {
         var field = {};

         if (this._options.isInputVisible) {
            field = InputRenderLookup.superclass._getField.call(this);
         }

         return field;
      },

      _getReadOnlyField: function() {
         return {};
      },

      _getTooltip: function() {
         var tooltip = this._options.tooltip;

         if (this._options.isInputVisible) {
            tooltip = InputRenderLookup.superclass._getTooltip.call(this);
         }

         return tooltip;
      },

      _keyDownInput: function(event) {
         this._notify('keyDownInput', [event]);
      }
   });

   export = InputRenderLookup;

