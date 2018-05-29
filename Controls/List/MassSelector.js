define('Controls/List/MassSelector', [
   'Core/Control',
   'tmpl!Controls/List/MassSelector/MassSelector',
   'Controls/Container/MassSelector/MassSelectorContextField'
], function(Control, template, MassSelectorContextField) {
   var MassSelector = Control.extend({
      _template: template,
      _selectedKeys: null,
      _contextItemsReadyCallback: null,

      _beforeMount: function(newOptions, context) {
         this._itemsReadyCallback = this._itemsReady.bind(this);
         this._selectedKeys = context.selection.selectedKeys;
         this._contextItemsReadyCallback = context.selection.itemsReadyCallback;
      },

      _beforeUpdate: function(newOptions, context) {
         this._selectedKeys = context.selection.selectedKeys;
      },

      _selectedKeysChangedHandler: function(event, selectedKeys) {
         this._notify('selectedKeysChanged', [selectedKeys], {
            bubbling: true
         });
      },

      _itemsReady: function(items) {
         this._contextItemsReadyCallback(items);
      }
   });

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: MassSelectorContextField
      };
   };

   return MassSelector;
});
