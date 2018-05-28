define('Controls/List/MassSelector', [
   'Core/Control',
   'tmpl!Controls/List/MassSelector/MassSelector',
   'Controls/Container/MassSelector/MassSelectorContextField'
], function(Control, template, MassSelectorContextField) {
   var MassSelector = Control.extend({
      _template: template,
      _excludedKeys: null,
      _selectedKeys: null,
      _items: null,
      _all: false,

      _beforeMount: function(newOptions, context) {
         this._itemsReadyCallback = this._itemsReady.bind(this);
         this._selectedKeys = context.selection.selectedKeys;
         this._excludedKeys = context.selection.excludedKeys;
         this._all = this._selectedKeys && this._selectedKeys[0] === null;
      },

      _beforeUpdate: function(newOptions, context) {
         this._selectedKeys = context.selection.selectedKeys;
         this._excludedKeys = context.selection.excludedKeys;

         if (
            this._selectedKeys &&
            this._selectedKeys[0] === null &&
            this._items
         ) {
            //todo: оптимизировать
            this._all = true;
            this._selectedKeys = [];
            this._items.forEach(
               function(item) {
                  var key = item.getId();
                  if (this._excludedKeys.indexOf(key) < 0) {
                     this._selectedKeys.push(key);
                  }
               }.bind(this)
            );
         }
      },

      _selectedKeysChangedHandler: function(event, selectedKeys) {
         var selected,
            excluded = this._excludedKeys;

         if (this._all) {
            excluded = [];
            this._items.forEach(function(item) {
               var key = item.getId();
               if (selectedKeys.indexOf(key) < 0) {
                  excluded.push(key);
               }
            });
            selected = [null];
         } else if (this._items.getCount() === selectedKeys.length) {
            selected = [null];
            excluded = [];
         } else {
            selected = selectedKeys;
         }

         this._notify('selectedKeysChanged', [selected, excluded], {
            bubbling: true
         });
      },

      _itemsReady: function(items) {
         this._items = items;
      }
   });

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: MassSelectorContextField
      };
   };

   return MassSelector;
});
