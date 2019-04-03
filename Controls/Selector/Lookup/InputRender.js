define('Controls/Selector/Lookup/InputRender', [
   'Controls/input',
   'wml!Controls/Selector/Lookup/InputRender/InputRender'
], function(input, template) {
   'use strict';

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

   return InputRenderLookup;
});
