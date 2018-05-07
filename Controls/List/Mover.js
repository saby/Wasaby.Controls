define('Controls/List/Mover', [
   'Core/Control',
   'Core/Deferred',
   'Core/core-instance',
   'tmpl!Controls/List/Mover/Mover'
], function(Control, Deferred, cInstance, template) {

   var BEFORE_ITEMS_MOVE_RESULT = {
      CUSTOM: 'Custom',
      MOVE_IN_ITEMS: 'MoveInItems'
   };

   var _private = {
      beforeItemsMove: function(self, items, target, position) {
         var beforeItemsMoveResult = self._notify('beforeItemsMove', [items, target, position]);
         return beforeItemsMoveResult instanceof Deferred ? beforeItemsMoveResult : Deferred.success(beforeItemsMoveResult);
      },
      afterItemsMove: function(self, items, target, position, result) {
         self._notify('afterItemsMove', [items, target, position, result]);
      },
      moveInItems: function(self, items, target, position) {
         var movedItems = [];

         items.forEach(function(item) {
            if (cInstance.instanceOfModule(item, 'WS.Data/Entity/Model')) {
               movedItems.push(item);
            } else {
               item = self._options.listModel.getItemById(item);
               if (item) {
                  movedItems.push(item.getContents());
               }
            }
         }, self);

         self._options.listModel.moveItems(movedItems, target, position);
      },
      moveInSource: function(self, items, target, position) {
         var
            idArray = items.map(function(item) {
               return cInstance.instanceOfModule(item, 'WS.Data/Entity/Model') ? item.get(self._options.keyProperty) : item;
            }, self);

         return self._options.sourceController.move(idArray, target.get(self._options.keyProperty), {
            position: position
         });
      },
      moveItemToSiblingPosition: function(self, item, position) {
         var
            itemIndex = self._options.listModel.getIndexBySourceItem(item),
            target = self._options.listModel.at(position === 'before' ? --itemIndex : ++itemIndex);

         if (target) {
            self.moveItems([item], target.getContents(), position);
         }
      }
   };

   /**
    * A class that describes the action of moving list items up/down.
    * @class Controls/List/Mover
    * @extends Core/Control
    * @mixes Controls/interface/IReorderMovable
    * @control
    * @author Крайнов Д.О.
    * @public
    * @category List
    */

   var Mover = Control.extend({
      _template: template,

      moveItemUp: function(item) {
         _private.moveItemToSiblingPosition(this, item, 'before');
      },

      moveItemDown: function(item) {
         _private.moveItemToSiblingPosition(this, item, 'after');
      },

      moveItems: function(items, target, position) {
         var self = this;

         if (target && items.length > 0) {
            _private.beforeItemsMove(this, items, target, position).addCallback(function(beforeItemsMoveResult) {
               if (beforeItemsMoveResult === BEFORE_ITEMS_MOVE_RESULT.MOVE_IN_ITEMS) {
                  _private.moveInItems(self, items, target, position);
               } else if (beforeItemsMoveResult !== BEFORE_ITEMS_MOVE_RESULT.CUSTOM) {
                  return _private.moveInSource(self, items, target, position).addCallback(function(moveResult) {
                     _private.moveInItems(self, items, target, position);
                     return moveResult;
                  });
               }
            }).addBoth(function(result) {
               _private.afterItemsMove(self, items, target, position, result);
            });
         }
      }
   });

   return Mover;
});
