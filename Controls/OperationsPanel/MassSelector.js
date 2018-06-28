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
      _multiSelectStatus: false,
      _menuCaption: 'Отметить',
      _menuSource: null,

      _beforeMount: function(newOptions, context) {
         this._updateSelection(context.selection);
      },

      _beforeUpdate: function(newOptions, context) {
         this._menuSource = this._getHierarchyMenuItems();
         this._updateSelection(context.selection);
      },

      _updateSelection: function(selection) {
         this._updateMultiSelectStatus(selection.count);
         this._updateMultiSelectCaption(selection.count);
      },

      _updateMultiSelectStatus: function(count) {
         this._multiSelectStatus =
            count === 'all'
               ? true
               : count === 'part' || count !== 0
                  ? null
                  : false;
      },

      _updateMultiSelectCaption: function(count) {
         this._menuCaption =
            this._multiSelectStatus === true
               ? 'Отмечено всё'
               : count !== 'part'
                  ? count === 0
                     ? 'Отметить'
                     : 'Отмечено (' + count + ')'
                  : 'Отмечено';
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
