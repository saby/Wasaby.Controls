define('js!SBIS3.CONTROLS.ItemsMoveController', [
   'Core/Abstract'
], function (cAbstract) {
   /**
    * Контроллер, позволяющий добавить в представление данных возможность перемещения элементов
    * @mixin SBIS3.CONTROLS.ItemsMoveController
    * @public
    * @author Авраменко Алексей Сергеевич
    */
   var ItemsMoveController = cAbstract.extend(/**@lends SBIS3.CONTROLS.ItemsMoveController.prototype*/{
      $protected: {
         _options: {
            linkedView: undefined
         }
      },

      $constructor: function() {
         var
            linkedView = this._options.linkedView; //getItemsActions().getItems().getRawData()
         linkedView.setItemsActions(this._prepareItemsActions(linkedView._options.itemsActions));
         linkedView.subscribe('onChangeHoveredItem', this._onChangeHoveredItem.bind(this));
         linkedView.subscribe('onSelectedItemsChange', this._onSelectedItemsChange.bind(this));

         this._publish('onItemMove');
      },

      moveItem: function(item, at) {
         var
            linkedView = this._options.linkedView,
            items = linkedView.getItems(),
            moveTo = items.at(items.getIndex(item) + (at === 'before' ? -1 : 1)),
            selectedKeys = linkedView.getSelectedKeys(),
            newItemIndex = Array.indexOf(selectedKeys, moveTo.getId()),
            currentItemIndex = Array.indexOf(selectedKeys, item.getId());
         // При перемещении записи необходимо менять её позицию в рекордсете
         linkedView.move([item], moveTo, at);
         // и в списке выбранных записей
         selectedKeys[newItemIndex] = item.getId();
         selectedKeys[currentItemIndex] = moveTo.getId();
         // Перед установкой нового порядка выделенных записей - нужно обнулить выделение, иначе обновление массива выделенных ключей не произойдет
         linkedView.getSelectedItems().clear();
         linkedView.setSelectedKeys(selectedKeys);

         this._notify('onItemMove', item);
      },

      _prepareItemsActions: function(itemsActions) {
         var
            self = this;
         itemsActions.push(
            {
               name: 'moveDown',
               tooltip: 'Переместить вниз',
               icon: 'icon-16 icon-ArrowDown icon-primary',
               isMainAction: true,
               onActivated: function(element, id, item) {
                  self.moveItem(item, 'after');
               }
            },
            {
               name: 'moveUp',
               tooltip: 'Переместить вверх',
               icon: 'icon-16 icon-ArrowUp icon-primary',
               isMainAction: true,
               onActivated: function(element, id, item) {
                  self.moveItem(item, 'before');
               }
            });
         return itemsActions;
      },

      _onSelectedItemsChange: function(event, selectedKeys, changes) {
         var
            items = this._options.linkedView.getItems(),
            item, selectedKeysCount;
         // Костыль до 3.7.5.30. В 3.7.5.30 он выпилен вместе с функционалом перемещения записи вверх при отметке.
         if (changes.added.length === 1) {
            item = items.getRecordById(changes.added[0]);
            selectedKeysCount = selectedKeys.length;
            if (selectedKeysCount > 1) {
               this._moveItem(item, items.getRecordById(selectedKeys[selectedKeysCount - 2]), 'after');
            } else {
               this._moveItem(item, items.at(0), 'before');
            }
         } else if (changes.removed.length) {
            item = items.getRecordById(changes.removed[0]);
            selectedKeysCount = selectedKeys.length;
            if (selectedKeysCount) {
               this._moveItem(item, items.getRecordById(selectedKeys[selectedKeysCount - 1]), 'after');
            }
         }
      },

      _moveItem: function(item, target, position) {
         this._options.linkedView.move([item], target, position);
         this._updateItemsActions(item);
      },

      _updateItemsActions: function(item) {
         var
            linkedView = this._options.linkedView,
            items = linkedView.getItems(),
            selectedKeys = linkedView.getSelectedKeys(),
            itemsInstances = linkedView.getItemsActions().getItemsInstances(),
            showMoveUp = false,
            showMoveDown = false,
            nextItem, prevItem;

         if (Array.indexOf(selectedKeys, item.getId()) !== -1) {
            prevItem = items.at(items.getIndex(item) - 1);
            nextItem = items.at(items.getIndex(item) + 1);
            if (prevItem && Array.indexOf(selectedKeys, prevItem.getId()) !== -1) {
               showMoveUp = true;
            }
            if (nextItem && Array.indexOf(selectedKeys, nextItem.getId()) !== -1) {
               showMoveDown = true;
            }
         }

         itemsInstances['moveUp'].toggle(showMoveUp);
         itemsInstances['moveDown'].toggle(showMoveDown);
      },

      _onChangeHoveredItem: function(event, hoveredItem) {
         if (hoveredItem.record) {
            this._updateItemsActions(hoveredItem.record);
         }
      }
   });

   return ItemsMoveController;

});