define('Controls-demo/List/Remove', [
   'Core/Control',
   'Controls-demo/List/Remove/RemoveDemoSource',
   'tmpl!Controls-demo/List/Remove/Remove',
   'css!Controls-demo/List/Remove/Remove'
], function (BaseControl, DemoSource, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: undefined,
      _items: [{
         id: 0,
         title: 'Стандартное удаление записи'
      }, {
         id: 1,
         title: 'Удаление записи с вопросом'
      }, {
         id: 2,
         title: 'Удаление записи с ошибкой'
      }, {
         id: 3,
         title: 'Долгое удаление записи'
      }],

      _beforeMount: function() {
         var self = this;
         this._viewSource = new DemoSource({
            idProperty: 'id',
            data: this._items
         });

         this._itemActions = [{
            id: 0,
            icon: 'icon-Erase icon-error',
            main: true,
            handler: function(item) {
               self._children.list.remove([item.getId()]);
            }
         }];
      },

      _onBeginRemove: function(event, items) {
         if (items.indexOf(1) !== -1) {
            return this._children.popupOpener.open({
               message: 'Remove items?',
               type: 'yesno'
            });
         }
      },

      _onEndRemove: function(event, items, result) {
         if (result instanceof Error) {
            this._children.popupOpener.open({
               message: result.message,
               style: 'error',
               type: 'ok'
            });
         }
      }
   });
   return ModuleClass;
});