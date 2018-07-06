define('Controls/OperationsPanel/MultiSelector', [
   'Core/Control',
   'tmpl!Controls/OperationsPanel/MultiSelector/MultiSelector',
   'WS.Data/Source/Memory',
   'Controls/Container/MultiSelector/SelectionContextField',
   'css!Controls/OperationsPanel/MultiSelector/MultiSelector'
], function(Control, template, Memory, SelectionContextField) {
   'use strict';
   var _defaultItems = [
      {
         id: 1,
         title: 'Всё'
      },
      {
         id: 2,
         title: 'Снять'
      },
      {
         id: 3,
         title: 'Инвертировать'
      }
   ];

   var MultiSelector = Control.extend({
      _template: template,
      _multiSelectStatus: false,
      _menuCaption: 'Отметить',
      _menuSource: null,

      _beforeMount: function(newOptions, context) {
         this._menuSource = this._getHierarchyMenuItems();
         this._updateSelection(context.selection);
      },

      _beforeUpdate: function(newOptions, context) {
         this._menuSource = this._getHierarchyMenuItems();
         this._updateSelection(context.selection);
      },

      _updateSelection: function(selection) {
         //TODO: нет excludedKeys, есть items и selectedKeys
         this._updateMultiSelectStatus(selection.selectedKeys, selection.excludedKeys);
         this._updateMultiSelectCaption(selection.count);
      },

      _updateMultiSelectStatus: function(selectedKeys, excludedKeys) {
         this._multiSelectStatus =
            selectedKeys[0] === null && !excludedKeys.length
               ? true
               : selectedKeys.length > 0
                  ? null
                  : false;
      },

      _updateMultiSelectCaption: function(count) {
         if (this._multiSelectStatus === true) {
            this._menuCaption = 'Отмечено всё';
         }
         if (this._multiSelectStatus === null) {
            this._menuCaption = 'Отмечено (' + count + ')';
         }
         if (this._multiSelectStatus === false) {
            this._menuCaption = 'Отметить';
         }
      },

      _getHierarchyMenuItems: function() {
         return new Memory({
            idProperty: 'id',
            data: _defaultItems
         });
      },

      _onCheckBoxClick: function() {
         if (this._multiSelectStatus !== false) {
            this._notify('selectedTypeChanged', ['unselectAll'], {
               bubbling: true
            });
         } else {
            this._notify('selectedTypeChanged', ['selectAll'], {
               bubbling: true
            });
         }
      },

      _onMenuItemActivate: function(event, model) {
         var id = model.get('id');
         if (id === 1) {
            this._notify('selectedTypeChanged', ['selectAll'], {
               bubbling: true
            });
         }
         if (id === 2) {
            this._notify('selectedTypeChanged', ['unselectAll'], {
               bubbling: true
            });
         }
         if (id === 3) {
            this._notify('selectedTypeChanged', ['toggleAll'], {
               bubbling: true
            });
         }
      }
   });

   MultiSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };

   return MultiSelector;
});
