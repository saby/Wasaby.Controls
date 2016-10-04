/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.MoveHandlers', [
   'js!SBIS3.CONTROLS.Action.List.InteractiveMove',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/MoveStrategy/Base',
   'i18n!SBIS3.CONTROLS.MoveHandlers'
], function(InteractiveMove, Di, Utils) {
   /**
    *
    * Миксин определяющий логику перемещения элементов
    * @mixin SBIS3.CONTROLS.MoveHandlers
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   var MoveHandlers = {
      /**
       * @typedef {String} Position
       * @variant on Вставить перемещаемые элементы внутрь целевой записи.
       * @variant after Вставить перемещаемые элементы после целевой записи.
       * @variant before Вставить перемещаемые элементы перед целевой записью.
       */
      $protected: {
        _options: {
           moveStrategy: 'movestrategy.base'
        }
      },
      /**
       * Перемещает записи через диалог. По умолчанию берет все выделенные записи.
       * @param {Array} MovedItems Массив перемещаемых записей
       * @deprecated Используйте SBIS3.CONTROLS.Action.List.InteractiveMove.
       */
      moveRecordsWithDialog: function(movedItems) {
         var
            action = new InteractiveMove({
               linkedObject: this,
               parentProperty: this._options.hierField,
               moveStrategy: this.getMoveStrategy()
            }),
            items = this.getItems();
         $ws.helpers.forEach(movedItems, function(item, i) {
            if (!$ws.helpers.instanceOfModule(item, 'WS.Data/Entity/Record')) {
               movedItems[i] = items.getRecordById(item);
            }
         }, this);
         Utils.logger.stack(this._moduleName + 'Method "moveRecordsWithDialog" is deprecated and will be removed in 3.7.5. Use "SBIS3.CONTROLS.Action.List.InteractiveMove"', 1);
         action.execute({movedItems: movedItems});
      },
      /**
       * Перемещает переданные записи
       * @param {Array} movedItems  Массив перемещаемых записей.
       * @param {WS.Data/Entity/Model} target Запись к которой надо преместить..
       * @param {Position} position Как перемещать записи
       * @private
       */
      _move: function(movedItems, target, position) {
         this._toggleIndicator(true);
         var moveStrategy = this.getMoveStrategy(),
            deferred;
         if ($ws.helpers.instanceOfModule(moveStrategy, 'WS.Data/MoveStrategy/Sbis')){
            //todo метод на время переходного периода, нужно перевести всех прикладников на новый метод и тока потом отпилить
            //свои стратегии они наследуют от MoveStrategy/Sbis туда добавлен костыль.
            deferred = moveStrategy.moveNew(movedItems, target, position);
         } else {
            deferred = moveStrategy.move(movedItems, target, position);
         }
         deferred.addCallback(function(result){
            if (result !== false){
               this.removeItemsSelectionAll();
            }
         }.bind(this)).addBoth(function(){
            this._toggleIndicator(false);
         }.bind(this));
      },
      /**
       * Перемещает выделенные записи.
       * @param {WS.Data/Entity/Model|String} target  К какой записи переместить выделенные. Модель либо ее идентификатор.
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
       * @remark Сингнатура метода соответсвует обработчику быстрых операций над записью.
       * @param {String} tr Строка содержащая html-представление записи
       * @param {String} id Идентификатор записи
       * @param {WS.Data/Entity/Record} record Запись
       */
      moveRecordDown: function(tr, id, record) {
         var nextItem = this.getNextItemById(id);
         if(nextItem) {
            this.getMoveStrategy().reorderMove([record], this.getItems().getRecordById(nextItem.data('id')), true);
         }
      },
      /**
       * Обработчик для быстрой операции над записью. Переместить на одну запись вверх.
       * @remark Сингнатура метода соответсвует обработчику быстрых операций над записью.
       * @param {String} tr Строка содержащая html-представление записи
       * @param {String} id Идентификатор записи
       * @param {WS.Data/Entity/Record} record Запись
       */
      moveRecordUp: function(tr, id, record) {
         var prevItem = this.getPrevItemById(id);
         if(prevItem) {
            this.getMoveStrategy().reorderMove([record], this.getItems().getRecordById(prevItem.data('id')), false);
         }
      },
      /**
       * Перемещает записи из внешнего контрола, через drag'n'drop
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
                  def = this.getMoveStrategy().reorderMove(movedItems, dragObject.getTarget().getModel(), target.getPosition() === 'after');
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