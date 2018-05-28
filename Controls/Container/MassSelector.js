define('Controls/Container/MassSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MassSelector/MassSelector',
   'Controls/Container/MassSelector/MassSelectorContextField'
], function(
   Control,
   template,
   MassSelectorContextField
) {
   return Control.extend({

      _template: template,
      _selectedKeys: null,
      _excludedKeys: null,

      _updateSelection: function(selectedKeys, excludedKeys) {
         this._context = new MassSelectorContextField(selectedKeys, excludedKeys);
      },

      _beforeMount: function() {
         this._context = new MassSelectorContextField(null, null);
      },

      _selectedKeysChangedHandler: function(event, selectedKeys) {
         this._selectedKeys = selectedKeys;
         this._updateSelection(this._selectedKeys, this._excludedKeys);
      },

      _excludedKeysChangedHandler: function(event, excludedKeys) {
         this._excludedKeys = excludedKeys;
         this._updateSelection(this._selectedKeys, this._excludedKeys);
      },

      // Объявляем функцию, которая возвращает поля Контекста и их значения.
      // Имя функции фиксировано.
      _getChildContext: function() {

         // Возвращает объект.
         return {
            selection: this._context
         };
      }
   });
});
