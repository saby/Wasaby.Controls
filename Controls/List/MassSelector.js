define('Controls/List/MassSelector', [
   'Core/Control',
   'tmpl!Controls/List/MassSelector/MassSelector',
   'Controls/Container/MassSelector/MassSelectorContextField'
], function(Control, template, MassSelectorContextField) {
   var MassSelector = Control.extend({
      _template: template,
      excludedKeys: null,
      selectedKeys: null,

      _beforeMount: function(newOptions, context) {
         if (context && context.selection) {
            this.selectedKeys = context.selection.selectedKeys;
            this.excludedKeys = context.selection.excludedKeys;
         } else {
            this.selectedKeys = newOptions.selectedKeys;
            this.excludedKeys = newOptions.excludedKeys;
         }
      },

      _beforeUpdate: function(newOptions, context) {
         if (context && context.selection) {
            this.selectedKeys = context.selection.selectedKeys;
            this.excludedKeys = context.selection.excludedKeys;
         }
      },

      _selectedKeysChangedHandler: function(event, selectedKeys) {
         this._notify('selectedKeysChanged', [selectedKeys], {
            bubbling: true
         });
      },

      _excludedKeysChangedHandler: function(event, excludedKeys) {
         this._notify('excludedKeysChanged', [excludedKeys], {
            bubbling: true
         });
      }
   });

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: MassSelectorContextField
      };
   };

   return MassSelector;
});
