define('Controls/List/Mover', [
   'Core/Control',
   'Core/Deferred',
   'Core/core-instance',
   'WS.Data/Source/ISource',
   'Controls/Container/Data/ContextOptions',
   'wml!Controls/List/Mover/Mover'
], function(Control, Deferred, cInstance, ISource, dataOptions, template) {

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
         if (position === ISource.MOVE_POSITION.on) {
            _private.hierarchyMove(self, items, target);
         } else {
            _private.reorderMove(self, items, target, position);
         }
      },

      reorderMove: function(self, items, target, position) {
         var
            itemIndex,
            movedItem,
            parentProperty = self._options.parentProperty,
            targetId = _private.getIdByItem(self, target),
            targetItem = _private.getModelByItem(self, targetId),
            targetIndex = self._items.getIndex(targetItem);

         items.forEach(function(item) {
            movedItem = _private.getModelByItem(self, item);
            if (movedItem) {
               itemIndex = self._items.getIndex(movedItem);
               if (itemIndex === -1) {
                  self._items.add(movedItem);
                  itemIndex = self._items.getCount() - 1;
               }

               if (parentProperty && targetItem.get(parentProperty) !== movedItem.get(parentProperty)) {
                  //if the movement was in order and hierarchy at the same time, then you need to update parentProperty
                  movedItem.set(parentProperty, targetItem.get(parentProperty));
               }

               if (position === ISource.MOVE_POSITION.after && targetIndex < itemIndex) {
                  targetIndex = (targetIndex + 1) < self._items.getCount() ? targetIndex + 1 : self._items.getCount();
               } else if (position === ISource.MOVE_POSITION.before && targetIndex > itemIndex) {
                  targetIndex = targetIndex !== 0 ? targetIndex - 1 : 0;
               }
               self._items.move(itemIndex, targetIndex);
            }
         });
      },

      hierarchyMove: function(self, items, target) {
         var targetId = _private.getIdByItem(self, target);
         items.forEach(function(item) {
            item = _private.getModelByItem(self, item);
            if (item) {
               item.set(self._options.parentProperty, targetId);
            }
         });
      },

      moveInSource: function(self, items, target, position) {
         var
            idArray = items.map(function(item) {
               return _private.getIdByItem(self, item);
            }),
            targetId = _private.getIdByItem(self, target);

         return self._source.move(idArray, targetId, {
            position: position,
            parentProperty: self._options.parentProperty
         });
      },

      moveItemToSiblingPosition: function(self, item, position) {
         var
            itemIndex = self._items.getIndex(_private.getModelByItem(self, item)),
            target = self._items.at(position === ISource.MOVE_POSITION.before ? --itemIndex : ++itemIndex);

         if (target) {
            self.moveItems([item], target, position);
         }
      },

      updateDataOptions: function(self, dataOptions) {
         if (dataOptions) {
            self._items = dataOptions.items;
            self._source = dataOptions.source;
            self._keyProperty = dataOptions.keyProperty;
         }
      },

      checkItem: function(self, item, target, position) {
         var
            key,
            parentsMap,
            movedItem = _private.getModelByItem(self, item);

         if (target !== null) {
            target = _private.getModelByItem(self, target);
         }

         if (self._options.parentProperty) {
            if (target && position === ISource.MOVE_POSITION.on && target.get(self._options.nodeProperty) === null) {
               return false;
            }
            parentsMap = _private.getParentsMap(self, _private.getIdByItem(self, target));
            key = '' + movedItem.get(self._keyProperty);
            if (parentsMap.indexOf(key) !== -1) {
               return false;
            }
         }
         return true;
      },

      getParentsMap: function(self, id) {
         var
            item,
            toMap = [],
            items = self._items,
            path = items.getMetaData().path;

         item = items.getRecordById(id);
         while (item) {
            id = '' + item.get(self._keyProperty);
            if (toMap.indexOf(id) === -1) {
               toMap.push(id);
            } else {
               break;
            }
            id = item.get(self._options.parentProperty);
            item = items.getRecordById(id);
         }
         if (path) {
            path.forEach(function(elem) {
               if (toMap.indexOf(elem.get(self._keyProperty)) === -1) {
                  toMap.push('' + elem.get(self._keyProperty));
               }
            });
         }
         return toMap;
      },

      getModelByItem: function(self, item) {
         return cInstance.instanceOfModule(item, 'WS.Data/Entity/Model') ? item : self._items.getRecordById(item);
      },

      getIdByItem: function(self, item) {
         return cInstance.instanceOfModule(item, 'WS.Data/Entity/Model') ? item.get(self._keyProperty) : item;
      }
   };

   /**
    * A class that describes the action of moving list items.
    * @class Controls/List/Mover
    * @extends Core/Control
    * @mixes Controls/interface/IMovable
    * @control
    * @author Крайнов Д.О.
    * @public
    * @category List
    */

   var Mover = Control.extend({
      _template: template,
      _beforeMount: function(options, context) {
         _private.updateDataOptions(this, context.dataOptions);
      },

      _beforeUpdate: function(options, context) {
         _private.updateDataOptions(this, context.dataOptions);
      },

      moveItemUp: function(item) {
         _private.moveItemToSiblingPosition(this, item, ISource.MOVE_POSITION.before);
      },

      moveItemDown: function(item) {
         _private.moveItemToSiblingPosition(this, item, ISource.MOVE_POSITION.after);
      },

      moveItems: function(items, target, position) {
         var self = this;

         items = items.filter(function(item) {
            return _private.checkItem(self, item, target, position);
         });
         if (target !== undefined && items.length > 0) {
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

   Mover.contextTypes = function() {
      return {
         dataOptions: dataOptions
      };
   };

   return Mover;
});
