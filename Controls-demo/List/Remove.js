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
         title: 'Запись 1'
      }, {
         id: 2,
         title: 'Запись 2'
      }, {
         id: 3,
         title: 'Запись 3'
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
            handler: function(item){
               self._children.list.remove([item.getId()]);
            }
         }];
      }
   });
   return ModuleClass;
});