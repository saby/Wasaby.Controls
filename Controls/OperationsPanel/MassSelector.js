define('Controls/OperationsPanel/MassSelector', [
   'Core/Control',
   'tmpl!Controls/OperationsPanel/MassSelector/MassSelector',
   'WS.Data/Source/Memory',
   'Controls/Container/MassSelector/MassSelectorContextField',
   'css!Controls/OperationsPanel/MassSelector/MassSelector'
], function(Control, template, Memory, MassSelectorContextField) {
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

   var MassSelector = Control.extend({
      _template: template,
      _multiSelectStatus: null,
      _menuCaption: 'Отметить',

      _beforeMount: function(newOptions, context) {
         var selection = context.selection;
         this._updateMltiSelectStatus(selection);
      },

      _beforeUpdate: function(newOptions, context) {
         var selection = context.selection;
         this._updateMltiSelectStatus(selection);
      },
      _updateMltiSelectStatus: function(selection) {
         this._multiSelectStatus =
            selection.selectedKeys && !!selection.selectedKeys.length // есть выделенные ключи
               ? selection.selectedKeys[0] === null //выделено всё
                  ? selection.excludedKeys && !!selection.excludedKeys.length //выделено всё и есть невыделенные
                     ? null
                     : true
                  : null
               : false;
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

   MassSelector.contextTypes = function contextTypes() {
      return {
         selection: MassSelectorContextField
      };
   };

   return MassSelector;
});
