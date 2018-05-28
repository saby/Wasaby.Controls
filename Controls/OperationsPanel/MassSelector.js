define('Controls/OperationsPanel/MassSelector', [
   'Core/Control',
   'tmpl!Controls/OperationsPanel/MassSelector/MassSelector',
   'WS.Data/Source/Memory',
   'css!Controls/OperationsPanel/MassSelector/MassSelector'
], function(Control, template, Memory) {
   'use strict';
   var _defaultItems = [
      {
         id: '1',
         title: 'Всё'
      },
      {
         id: '2',
         title: 'Снять'
      },
      {
         id: '3',
         title: 'Инвертировать'
      }
   ];
   var _private = {};

   var MassSelector = Control.extend({
      _template: template,
      _multiSelectStatus: null,
      _menuCaption: 'Отметить',

      _getHierarchyMenuItems: function() {
         return new Memory({
            idProperty: 'id',
            data: _defaultItems
         });
      },

      _onCheckBoxClick: function() {
         this._notify('selectedKeysChanged', [null], { bubling: true }); //test
      },

      _onMenuItemActivate: function() {
         this._notify('selectedKeysChanged', [null]); //test
         //this._notify('excludedKeysChanged', [selection.excluded]);
      }
   });

   return MassSelector;
});
