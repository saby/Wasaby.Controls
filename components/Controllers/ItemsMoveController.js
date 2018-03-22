define('SBIS3.CONTROLS/Controllers/ItemsMoveController', [
   'Core/Abstract'
], function (cAbstract) {
   /**
    * Контроллер, позволяющий добавить в представление данных возможность перемещения элементов
    * @mixin SBIS3.CONTROLS/Controllers/ItemsMoveController
    * @public
    * @author Авраменко А.С.
    */
   var ItemsMoveController = cAbstract.extend(/**@lends SBIS3.CONTROLS/Controllers/ItemsMoveController.prototype*/{
      $protected: {
         _options: {
            linkedView: undefined
         }
      },

      $constructor: function() {
         var
            linkedView = this._options.linkedView;
         linkedView.setItemsActions(this._prepareItemsActions(linkedView._options.itemsActions));
         linkedView.subscribe('onChangeHoveredItem', this._onChangeHoveredItem.bind(this));
      },

      _prepareItemsActions: function(itemsActions) {
         itemsActions.unshift(
            {
               name: 'moveDown',
               tooltip: rk('Переместить вниз'),
               icon: 'icon-16 icon-ArrowDown icon-primary',
               isMainAction: true,
               onActivated: function(element, id, item) {
                  this.moveRecordDown(item);
               }
            },
            {
               name: 'moveUp',
               tooltip: rk('Переместить вверх'),
               icon: 'icon-16 icon-ArrowUp icon-primary',
               isMainAction: true,
               onActivated: function(element, id, item) {
                  this.moveRecordUp(item);
               }
            });
         return itemsActions;
      },

      _updateItemsActions: function(item) {
         var linkedView = this._options.linkedView,
            itemsActions = linkedView.getItemsActions(),
            projection = linkedView._getItemsProjection();

         itemsActions.ready().addCallback(function() {
            var
               itemsInstances = itemsActions.getItemsInstances(),
               projectionItem = projection.getItemBySourceItem(item),
               nextItem = projection.getNext(projectionItem),
               prevItem = projection.getPrevious(projectionItem),
               showNextItem = nextItem && projection.getGroupByIndex(projection.getIndex(projectionItem)) == projection.getGroupByIndex(projection.getIndex(nextItem)),
               showPrevItem = prevItem && projection.getGroupByIndex(projection.getIndex(projectionItem)) == projection.getGroupByIndex(projection.getIndex(prevItem));
            itemsInstances['moveUp'].toggle(showPrevItem);
            itemsInstances['moveDown'].toggle(showNextItem);
         });
      },

      _onChangeHoveredItem: function(event, hoveredItem) {
         if (hoveredItem.record) {
            this._updateItemsActions(hoveredItem.record);
         }
      }
   });

   return ItemsMoveController;

});