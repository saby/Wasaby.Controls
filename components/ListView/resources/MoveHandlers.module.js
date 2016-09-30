/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.MoveHandlers', [
   'js!SBIS3.CONTROLS.Action.List.InteractiveMove',
   'js!WS.Data/Di',
   'js!WS.Data/MoveStrategy/Base',
   'i18n!SBIS3.CONTROLS.MoveHandlers'
], function(InteractiveMove, Di) {
   /**
    *
    * Миксин определяющий логику перемещения элементов
    * @mixin SBIS3.CONTROLS.MoveHandlers
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   var MoveHandlers = {
      $protected: {
        _options: {
           moveStrategy: 'movestrategy.base'
        }
      },
      /**
       * Перемещает записи через диалог. По умолчанию берет все выделенные записи.
       * @param [Array] MovedItems Массив рекордов, которые надо переместить
       * @deprecated Используйте SBIS3.CONTROLS.Action.List.InteractiveMove.
       */
      moveRecordsWithDialog: function(MovedItems) {
         var
            action = new InteractiveMove({
               linkedObject: this,
               parentProperty: this._options.hierField,
               moveStrategy: this.getMoveStrategy()
            });

         action.execute({records: MovedItems});
      },
      /**
       *
       * @param movedItems
       * @param target
       * @param position
       * @private
       */
      _move: function(movedItems, target, position) {
         this._toggleIndicator(true);
         this.getMoveStrategy().move(movedItems, target, position).addBoth(function(){
            this._toggleIndicator(false);
         }.bind(this));
      },
      /**
       * Перемещает выделенные элементы.
       * @param {WS.Data/Entity/Record|String} target  К какому элементу переместить выделенные. Рекорд либо его идентификатор в рекордсете.
       */
      selectedMoveTo: function(target) {
         var selectedItems = this.getSelectedItems(false);
         if (!$ws.helpers.instanceOfModule(target, 'WS.Data/Entity/Model')) {
            target = this.getItems().getRecordById(target);
         }
         this._move(selectedItems ? selectedItems.toArray() : [], target);
      },
      /**
       * Возвращает стратегию перемещения
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @returns {WS.Data/MoveStrategy/IMoveStrategy}
       */
      getMoveStrategy: function () {
         return this._moveStrategy || (this._moveStrategy = this._makeMoveStrategy());
      },
      /**
       * Создает стратегию перемещения в зависимости от источника данных
       * @returns {WS.Data/MoveStrategy/IMoveStrategy}
       * @private
       */
      _makeMoveStrategy: function () {
         if (!this._options.moveStrategy) {
            if ($ws.helpers.instanceOfModule(this._dataSource, 'WS.Data/Source/SbisService')) {
               this._options.moveStrategy = 'movestrategy.sbis';
            } else {
               this._options.moveStrategy = 'movestrategy.base';
            }
         }
         return Di.resolve(this._options.moveStrategy, {
            dataSource: this.getDataSource(),
            hierField: this._options.hierField,
            listView: this
         });
      },
      /**
       * Устанавливает стратегию перемещения
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @param {WS.Data/MoveStrategy/IMoveStrategy} strategy - стратегия перемещения
       */
      setMoveStrategy: function (strategy) {
         if(!$ws.helpers.instanceOfMixin(strategy,'WS.Data/MoveStrategy/IMoveStrategy')){
            throw new Error('The strategy must implemented interfaces the WS.Data/MoveStrategy/IMoveStrategy.')
         }
         this._moveStrategy = strategy;
      },
      /**
       * Обработчик для быстрой операции над запись. Переместить на одну запись ввниз.
       * @param tr
       * @param id
       * @param record
       */
      moveRecordDown: function(tr, id, record) {
         var nextItem = this.getNextItemById(id);
         if(nextItem) {
            this._moveRecord(record, nextItem.data('id'), true);
         }
      },
      /**
       * Обработчик для быстрой операции над записью. Переместить на одну запись вверх.
       * @param tr
       * @param id
       * @param record
       */
      moveRecordUp: function(tr, id, record) {
         var prevItem = this.getPrevItemById(id);
         if(prevItem) {
            this._moveRecord(record, prevItem.data('id'), false);
         }
      },
      /**
       * Перемещает элементы из внешнего контрола, через drag'n'drop
       * @param {SBIS3.CONTROLS.DragObject} dragObject
       * @private
       */
      _moveFromOutside: function(dragObject) {
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
               if (target.getPosition() === 'on') {
                  def = this.getMoveStrategy().hierarhyMove(movedItems, dragObject.getTarget().getModel());
               } else {
                  def = this.getMoveStrategy().move(movedItems, dragObject.getTarget().getModel(), target.getPosition() === 'after');
               }
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
      }
   };

   return MoveHandlers;
});