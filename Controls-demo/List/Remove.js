define('Controls-demo/List/Remove', [
   'Core/Control',
   'Core/core-clone',
   'Controls-demo/List/Remove/RemoveDemoSource',
   'tmpl!Controls-demo/List/Remove/Remove',
   'css!Controls-demo/List/Remove/Remove'
], function(BaseControl, cClone, DemoSource, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: undefined,
      _items: [
         {
            id: 0,
            title: 'Стандартное удаление записи'
         },
         {
            id: 1,
            title: 'Удаление записи с вопросом'
         },
         {
            id: 2,
            title: 'Удаление записи с ошибкой'
         },
         {
            id: 3,
            title: 'Долгое удаление записи'
         }
      ],

      _beforeMount: function() {
         this._viewSource = this._createSource(this._items);
         this._viewSourceClone = this._createSource(this._items);
         this._viewSourceSecond = this._createSource([{ id: 0 }]);

         this._itemActions = this._createItemsActions('list');
         this._itemActionsSecond = this._createItemsActions('listSecond');
      },

      _createSource: function(items) {
         return new DemoSource({
            idProperty: 'id',
            data: cClone(items)
         });
      },

      _createItemsActions: function(listName) {
         var self = this;
         return [
            {
               id: 0,
               icon: 'icon-Erase icon-error',
               showType: 2,
               handler: function(item) {
                  self._children[listName].removeItems([item.getId()]);
               }
            }
         ];
      },

      _beforeItemsRemove: function(event, items) {
         if (items.indexOf(1) !== -1) {
            return this._children.popupOpener.open({
               message: 'Remove items?',
               type: 'yesno'
            });
         }
      },

      _afterItemsRemove: function(event, items, result) {
         if (result instanceof Error) {
            this._showError(result.message);
         }
      },

      _secondListRemoveHandler: function() {
         this._showError('Events should not bubbling');
      },

      _showError: function(message) {
         this._children.popupOpener.open({
            message: message,
            style: 'error',
            type: 'ok'
         });
      }
   });
   return ModuleClass;
});
