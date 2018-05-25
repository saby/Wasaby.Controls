define('Controls-demo/DragNDrop/Container', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls-demo/DragNDrop/ListEntity',
   'tmpl!Controls-demo/DragNDrop/Container/Container',
   'css!Controls-demo/DragNDrop/Container/Container',
   'Controls/DragNDrop/Avatar'
], function(BaseControl, cClone, Memory, ListEntity, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: undefined,

      _beforeMount: function() {
         this._viewSource = this._createSource(this._createItems(0, 4));
         this._viewSourceSecond = this._createSource(this._createItems(4, 8));
         this._viewSourceThird = this._createSource(this._createItems(8, 12));
      },

      _beforeDragStart: function(event, items) {
         var hasBadItems = false;
         items.forEach(function(item) {
            if (item.getId() === 0) {
               hasBadItems = true;
            }
         });
         return hasBadItems ? false : new ListEntity({
            items: items
         });
      },


      _createSource: function(items) {
         return new Memory({
            idProperty: 'id',
            data: cClone(items)
         });
      },

      _onClick: function() {
         this._children.list.reload();
         this._children.listSecond.reload();
         this._children.listThird.reload();
         this._children.listNotes.reload();
      },

      _createItems: function(startIndex, endIndex) {
         var items = [];
         for (var i = startIndex; i < endIndex; i++) {
            items.push({
               id: i,
               title: 'Перемещаемая запись ' + i
            });
         }
         return items;
      }
   });
   return ModuleClass;
});
