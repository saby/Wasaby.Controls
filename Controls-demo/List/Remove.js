define('Controls-demo/List/Remove', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/List/Remove/Remove',
   'css!Controls-demo/List/Remove/Remove'
], function (BaseControl, MemorySource, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: undefined,
      _items: [{
         id: 1,
         title: 'Стандартное удаление записи'
      }, {
         id: 2,
         title: 'Удаление записи с вопросом'
      }, {
         id: 3,
         title: 'Удаление записи с ошибкой'
      }],

      _beforeMount: function() {
         var self = this;
         this._viewSource = new MemorySource({
            idProperty: 'id',
            data: this._items
         });
         this._itemActions = [{
            id: 1,
            icon: 'icon-Erase icon-error',
            main: true,
            handler: function(item) {
               var id = item.getId();
               if (id === 3) {
                  id = 'BadId';
               }
               self._children.list.remove(id);
            }
         }];
      },

      _onBeginRemove: function(event, items) {
         if (items.indexOf(2) !== -1) {
            return this._children.popupOpener.open({
               message: 'Remove items?',
               type: 'yesno'
            });
         }
      },

      _onEndRemove: function() {
         debugger;
      }
   });
   return ModuleClass;
});