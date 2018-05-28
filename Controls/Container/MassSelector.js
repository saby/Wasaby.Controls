define('Controls/Container/MassSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MassSelector/MassSelector',
   'Controls/Container/MassSelector/MassSelectorContextField',
   'Controls/Controllers/Multiselect/Selection'
], function(Control, template, MassSelectorContextField, MultiSelection) {
   return Control.extend({
      //todo: весь модуль
      _template: template,
      _multiselection: null,

      _updateSelection: function() {
         var selection = this._multiselection.getSelection();
         this._context = new MassSelectorContextField(
            selection.selected,
            selection.excluded
         );
      },

      _beforeMount: function(newOptions) {
         this._multiselection = new MultiSelection({
            selectedKeys: newOptions.selectedKeys,
            excludedKeys: newOptions.excludedKeys
         });

         var selection = this._multiselection.getSelection();

         this._context = new MassSelectorContextField(
            selection.selected,
            selection.excluded
         );
      },

      _selectedKeysChangedHandler: function(event, selectedKeys, excludedKeys) {
         this._multiselection.unselectAll();
         this._multiselection.select(selectedKeys);
         this._multiselection.unselect(excludedKeys);
         this._updateSelection();
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         this._multiselection[typeName]();
         this._updateSelection();
      },

      _getChildContext: function() {
         return {
            selection: this._context
         };
      }
   });
});
