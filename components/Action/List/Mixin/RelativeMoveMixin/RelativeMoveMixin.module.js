/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.RelativeMoveMixin',[
   "Core/ParallelDeferred",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "Core/helpers/helpers"
], function ( ParallelDeferred,colHelpers, cInstance, cHelpers) {
      'use strict';
      /**
       * Действие перемещения
       * @mixin SBIS3.CONTROLS.Action.List.RelativeMoveMixin
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      return /** @lends SBIS3.CONTROLS.Action.List.RelativeMoveMixin.prototype */{
         $protected: {
            options: {
               /**
                * @cfg  {String} название поля иерархии
                * */
               parentProperty: undefined
            }
         },
         /**
          *
          * перемещает элемент from к элементу to
          * @param {SBIS3.CONTROLS.Data.Model|Array} from
          * @param {SBIS3.CONTROLS.Data.Model} to
          * @param {Boolean} up Направление перемещения, если true то елемент from встанет выше эелемента to
          * @returns {$ws.proto.Deferred}
          */
         _move: function (from, to, up) {
            var self = this,
               def = new ParallelDeferred();
            if (cHelpers.type(from) !== 'array') {
               from = [from];
            }
            colHelpers.forEach(from, function(record) {
               def.push(self.getDataSource().move(record.getId(), to.getId(), {before: up}));
            });
            return  def.done().getResult().addCallback(function() {
               self.moveInItems(from, to, up);
            });
         },

         moveInItems: function (movedItems, target, up) {
            //в 3.7.4.220 этот файл удален а код переехал в стратегию перемещения, в 3.7.4.200 тут будет копипаста
            if (cInstance.instanceOfModule(this.getLinkedObject(), 'SBIS3.CONTROLS.ListView')) {
               var linkedObject =  this.getLinkedObject(),
                  items = this.getLinkedObject().getItems();
               if (items) {
                  cHelpers.forEach(movedItems, function (movedItem) {
                     var movedItemIndex = items.getIndex(target);
                     if (linkedObject.getHierField && linkedObject.getHierField()) {
                        //если перемещение было по порядку и иерархии одновременно, то надо обновить hierField
                        movedItem.set(linkedObject.getHierField(), target.get(linkedObject.getHierField()));
                     }
                     if (!up) {
                        movedItemIndex = (movedItemIndex + 1) < items.getCount() ? ++movedItemIndex : items.getCount();
                     } else {
                        movedItemIndex = (movedItemIndex - 1) > -1 ? movedItemIndex : 0;
                     }
                     if (items.getIndex(movedItem) < movedItemIndex && movedItemIndex > 0) {
                        movedItemIndex--; //если запись по списку сдвигается вниз то после ее удаления индексы сдвинутся
                     }
                     items.setEventRaising(false, true);
                     items.remove(movedItem);
                     items.add(
                        movedItem,
                        movedItemIndex < items.getCount() ? movedItemIndex : undefined
                     );
                     items.setEventRaising(true, true);
                  }.bind(this));
               }
            }
         }

      };
   }
);