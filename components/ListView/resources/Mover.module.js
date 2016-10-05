/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.ListView.Mover', [
   'js!WS.Data/Di'
], function (Di) {
   'use strict';
   /**
    * Перемещает элементы
    * @class SBIS3.CONTROLS.ListView.Mover
    * @private
    * @author Крайнов Дмитрий Олегович
    */
   var Mover = $ws.proto.Abstract.extend(/**@lends SBIS3.CONTROLS.ListView.Mover.prototype*/{
      $protected: {
         _options: {
            /**
             * @member {WS.Data/MoveStrategy/IMoveStrategy} Стратегия перемещения
             */
            moveStrategy: undefined,
            /**
             * @cfg {WS.Data/Collection/IList} Список, в котором надо перемещать записи.
             */
            items: undefined,
            /*
             * @cfg {WS.Data/Display/Display} Проекция элементов.
             */
            projection: undefined
         }
      },
      /**
       * Устанавливает контрол который инициализировал Drag'n'drop. Метод должен вызываться только из SBIS3.CONTROLS.DragNDropMixin
       * @param {SBIS3.CONTROLS.Control} owner контрол, который инициализировал Drag'n'drop
       * @protected
       */
      setOwner: function (owner) {
         this._owner = owner;
      },

      moveRecordDown: function(record) {
         this._moveToOneRow(record, true);
      },

      moveRecordUp: function(record) {
         this._moveToOneRow(record, false);
      },

      getItems: function(){
         return this._options.items;
      },

      _moveToOneRow: function(record, down) {
         var projection = this.getProjection(),
            item = projection.getItemBySourceItem(record),
            targetItem = down ? projection.getNext(item) : projection.getPrevious(item);
         if(targetItem) {
            this.getMoveStrategy().reorderMove([record], targetItem.getContents(), down);
         }
      },

      getProjection: function(){
         return this._options.projection;
      },

      /**
       * Перемещает записи из внешнего контрола, через drag'n'drop
       * @param {SBIS3.CONTROLS.DragObject} dragObject
       * @private
       */
      moveFromOutside: function(dragObject){
         var target = dragObject.getTarget(),
            dragSource = dragObject.getSource();
         if(dragObject.getSource().getAction()) {
            def = dragObject.getSource().getAction().execute();
         } else {
            var dragOwnerSource = dragObject.getOwner().getDataSource(),
               dataSource = this.getDataSource();
            var def;
            if (dataSource === dragOwnerSource || dragOwnerSource.getEndpoint().contract == dataSource.getEndpoint().contract) {
               var movedItems = [];
               dragSource.each(function (movedItem) {
                  movedItems.push(movedItem.getModel());
               });
               def = this.move(movedItems, dragObject.getTarget().getModel(), target.getPosition());
            }
         }
         def = (def instanceof $ws.proto.Deferred) ? def : new $ws.proto.Deferred().callback();
         var position = this.getItems().getIndex(target.getModel()),
            ownerItems = dragObject.getOwner().getItems(),
            self = this,
            operation = dragSource.getOperation();
         def.addCallback(function() {
            dragSource.each(function(movedItem) {
               var model = movedItem.getModel();
               if (operation === 'add' || operation === 'move') {
                  self.getItems().add(model.clone(), position);
               }
               if (operation === 'delete' || operation === 'move') {
                  ownerItems.remove(model);
               }
            });
         });
      },
      /**
       * Перемещает переданные записи
       * @param {Array} movedItems  Массив перемещаемых записей.
       * @param {WS.Data/Entity/Model} target Запись к которой надо преместить..
       * @param {Position} position Как перемещать записи
       */
      move: function(movedItems, target, position) {
         var deferred,
            moveStrategy = this.getMoveStrategy();
         if ($ws.helpers.instanceOfModule(moveStrategy, 'WS.Data/MoveStrategy/Sbis')){
            //todo метод на время переходного периода, нужно перевести всех прикладников на новый метод и тока потом отпилить
            //свои стратегии они наследуют от MoveStrategy/Sbis туда добавлен костыль.
            deferred = moveStrategy.moveNew(movedItems, target, position);
         } else {
            deferred = moveStrategy.move(movedItems, target, position);
         }
         return deferred;
      },

      //region move_strategy
      /**
       * Возвращает стратегию перемещения
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @returns {WS.Data/MoveStrategy/IMoveStrategy}
       */
      getMoveStrategy: function() {
         return this._options.moveStrategy;
      },
      /**
       * Устанавливает стратегию перемещения
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @param {WS.Data/MoveStrategy/IMoveStrategy} strategy - стратегия перемещения
       */
      setMoveStrategy: function (moveStrategy) {
         this._options.moveStrategy = strategy;
      }
      //endregion move_strategy
   });
   Di.register('listview.mover', Mover);
   return Mover;
});