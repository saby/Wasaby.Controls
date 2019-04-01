define('Controls/Selector/Lookup/InputRender', [
   'Controls/Input/Text',
   'wml!Controls/Selector/Lookup/InputRender/InputRender'
], function(InputText, template) {
   'use strict';

   var InputRenderLookup = InputText.extend({
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
