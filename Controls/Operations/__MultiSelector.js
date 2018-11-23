define('Controls/Operations/__MultiSelector', [
   'Core/Control',
   'wml!Controls/Operations/__MultiSelector',
   'WS.Data/Source/Memory'
], function(
   Control,
   template,
   Memory
) {
   'use strict';
   var _defaultItems = [{
      id: 'selectAll',
      title: 'Всё'
   }, {
      id: 'unselectAll',
      title: 'Снять'
   }, {
      id: 'toggleAll',
      title: 'Инвертировать'
   }];

   var MultiSelector = Control.extend({
      _template: template,
      _multiSelectStatus: undefined,
      _menuCaption: undefined,
      _menuSource: undefined,

      _beforeMount: function(newOptions) {
         this._menuSource = this._getMenuSource();
         this._updateSelection(newOptions.selectedKeys, newOptions.excludedKeys, newOptions.selectedKeysCount);
      },

      _getMenuSource: function() {
         return new Memory({
            idProperty: 'id',
            data: _defaultItems
         });
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.selectedKeys !== newOptions.selectedKeys || this._options.excludedKeys !== newOptions.excludedKeys || this._options.selectedKeysCount !== newOptions.selectedKeysCount) {
            this._updateSelection(newOptions.selectedKeys, newOptions.excludedKeys, newOptions.selectedKeysCount);
         }
      },

      _afterUpdate: function() {
         if (this._sizeChanged) {
            this._sizeChanged = false;
            this._notify('controlResize', [], { bubbling: true });
         }
      },

      _updateSelection: function(selectedKeys, excludedKeys, count) {
         if (selectedKeys[0] === null && !excludedKeys.length) {
            this._menuCaption = rk('Отмечено всё');
         } else if (count > 0) {
            this._menuCaption = rk('Отмечено') + ': ' + count;
         } else {
            this._menuCaption = rk('Отметить');
         }
         this._sizeChanged = true;
      },

      _onMenuItemActivate: function(event, model) {
         this._notify('selectedTypeChanged', [model.get('id')], {
            bubbling: true
         });
      }
   });

   return MultiSelector;
});
