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
         // и в списке выбранных записей (в случае если среди отмеченных присутствуют заменяемая запись)
         if (newItemIndex !== -1) {
            selectedKeys[newItemIndex] = item.getId();
            selectedKeys[currentItemIndex] = moveTo.getId();
         }
         // Перед установкой нового порядка выделенных записей - нужно обнулить выделение, иначе обновление массива выделенных ключей не произойдет
         linkedView.getSelectedItems().clear();
         linkedView.setSelectedKeys(selectedKeys);

         this._notify('onItemMove', item);
      },

      _prepareItemsActions: function(itemsActions) {
         var
            self = this;
         itemsActions.unshift(
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

      _updateItemsActions: function(item) {
         var
            linkedView = this._options.linkedView,
            items = linkedView.getItems(),
            itemsInstances = linkedView.getItemsActions().getItemsInstances(),
            nextItem, prevItem;

         prevItem = items.at(items.getIndex(item) - 1);
         nextItem = items.at(items.getIndex(item) + 1);
         itemsInstances['moveUp'].toggle(prevItem);
         itemsInstances['moveDown'].toggle(nextItem);
      },

      _onChangeHoveredItem: function(event, hoveredItem) {
         if (hoveredItem.record) {
            this._updateItemsActions(hoveredItem.record);
         }
      }
   });

   return ItemsMoveController;

});