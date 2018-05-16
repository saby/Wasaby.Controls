define('Controls-demo/Container/DragNDrop/Notes/Notes', [
   'Core/Control',
   'Core/core-clone',
   'Core/core-instance',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Container/DragNDrop/Notes/Notes',
   'Controls-demo/Container/DragNDrop/Notes/EntityTriangle',
   'Controls-demo/Container/DragNDrop/Notes/EntityNote',
   'css!Controls-demo/Container/DragNDrop/Notes/Notes'
], function(BaseControl, cClone, cInstance, Memory, template, EntityTriangle, EntityNote) {
   'use strict';

   var Notes = BaseControl.extend({
      _template: template,
      _itemActions: undefined,
      _items: [{
         id: 0,
         title: 'Заметка 1',
         dragging: false,
         position: {
            top: 200,
            left: 500
         },
         size: {
            width: 300,
            height: 100
         }
      }, {
         id: 1,
         title: 'Заметка 2',
         dragging: false,
         position: {
            top: 500,
            left: 600
         },
         size: {
            width: 200,
            height: 200
         }
      }],
      _startPosition: undefined,
      _startSize: undefined,

      reload: function() {
         this._children.notesList.reload();
      },

      _onMouseDownTriangle: function(event, itemData) {
         var entity = new EntityTriangle({
            item: itemData.item
         });
         this._children.dragNDrop.startDragNDrop(entity, event, {
            useAvatar: false
         });
         event.stopPropagation();
      },

      _onMouseDownNote: function(event, itemData) {
         var entity = new EntityNote({
            item: itemData.item
         });
         this._children.dragNDrop.startDragNDrop(entity, event, {
            useAvatar: false
         });
      },

      _beforeMount: function() {
         this._viewSource = new Memory({
            idProperty: 'id',
            data: this._items
         });
      },

      _afterDragStart: function(event, dragObject) {
         var
            item,
            entity = dragObject.entity;

         if (cInstance.instanceOfModule(entity, 'Controls-demo/Container/DragNDrop/Notes/EntityNote')) {
            item = entity.getItem();
            item.set('dragging', true);
         }
      },

      _dragEnd: function(event, dragObject) {
         var
            item,
            entity = dragObject.entity;

         if (cInstance.instanceOfModule(entity, 'Controls-demo/Container/DragNDrop/Notes/EntityNote')) {
            item = entity.getItem();
            if (!this._allowDrop(item.getId(), dragObject.position)) {
               item.set('position', entity.getStartPosition());
            }
            item.set('dragging', false);
            this._viewSource.update(item);
         } else if (cInstance.instanceOfModule(entity, 'Controls-demo/Container/DragNDrop/Notes/EntityTriangle')) {
            this._viewSource.update(entity.getItem());
         }
      },

      _allowDrop: function(id, position) {
         var
            badPosition,
            result = true;
         this._items.forEach(function(item) {
            if (item.id !== id) {
               badPosition = position.y > item.position.top && position.y < (item.position.top + item.size.height) &&
                             position.x > item.position.left && position.x < (item.position.left + item.size.width);

               result = result && !badPosition;
            }
         });

         return result;
      },

      _dragMove: function(event, dragObject) {
         var
            size,
            top, left,
            height, width,
            maxTop, maxLeft,
            entity = dragObject.entity;

         if (cInstance.instanceOfModule(entity, 'Controls-demo/Container/DragNDrop/Notes/EntityTriangle')) {
            height = entity.getStartSize().height + dragObject.offset.y;
            width = entity.getStartSize().width + dragObject.offset.x;
            entity.getItem().set('size', {
               height: height < 50 ? 50 : (height > 500 ? 500 : height),
               width: width < 150 ? 150 : (width > 500 ? 500 : width)
            });
         } else if (cInstance.instanceOfModule(entity, 'Controls-demo/Container/DragNDrop/Notes/EntityNote')) {
            size = entity.getItem().get('size');
            top = entity.getStartPosition().top + dragObject.offset.y;
            left = entity.getStartPosition().left + dragObject.offset.x;
            maxTop = window.innerHeight - size.height;
            maxLeft = window.innerWidth - size.width;
            entity.getItem().set('position', {
               top: top < 0 ? 0 : (top > maxTop ? maxTop : top),
               left: left < 0 ? 0 : (left > maxLeft ? maxLeft : left)
            });
         }
      }
   });

   return Notes;
});
