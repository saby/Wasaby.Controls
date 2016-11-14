/*global define, $*/
define('js!SBIS3.CONTROLS.ListView.Mover', [
   'js!WS.Data/Di',
   "Core/core-instance",
   "Core/Deferred",
   "Core/Abstract"
], function (Di, cInstance, Deferred, Abstract) {
   'use strict';
   /**
    * Перемещает элементы
    * @class SBIS3.CONTROLS.ListView.Mover
    * @private
    * @author Крайнов Дмитрий Олегович
    */
   var Mover = Abstract.extend(/**@lends SBIS3.CONTROLS.ListView.Mover.prototype*/{
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
            projection: undefined,
            /**
             *
             */
            hierField: undefined
         }
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
            this.getMoveStrategy().move([record], targetItem.getContents(), down);
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
         def = (def instanceof Deferred) ? def : new Deferred().callback();
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
         var
            result,
            isNodeTo = true,
            isChangeOrder = position !== 'on';

         if (!cInstance.instanceOfModule(target, 'WS.Data/Entity/Model')) {
            target = this.getItems().getRecordById(target);
         }

         if (target !== null) {
            isNodeTo = target.get(this._options.hierField + '@');
         }

         if (this._checkRecordsForMove(movedItems, target, isChangeOrder)) {
            if (isNodeTo && !isChangeOrder) {
               result = this.getMoveStrategy().hierarhyMove(movedItems, target);
            } else if(isChangeOrder)  {
               result = this.getMoveStrategy().move(movedItems, target, position == 'after');
            }
         }
         return (result instanceof Deferred) ? result : new Deferred().callback(result);
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
      },
      //endregion move_strategy
      //region checkmove
      /**
       * Проверяет можно ли перенести элементы
       * @param {Array} movedItems Массив перемещаемых элементов
       * @param {WS.Data/Entity/Record} target рекорд к которому надо переместить
       * @param {Boolean} isChangeOrder Изменяется порядок элементов
       * @returns {Boolean}
       * @private
       */
      _checkRecordsForMove: function(movedItems, target, isChangeOrder) {
         var
            key,
            toMap = [];
         if (target === undefined) {
            return false;
         }
         if (target !== null && this._options.hierField) {
            toMap = this._getParentsMap(target.getId());
         }
         for (var i = 0; i < movedItems.length; i++) {
            key = '' + (cInstance.instanceOfModule(movedItems[i], 'WS.Data/Entity/Model') ? movedItems[i].getId() : movedItems[i]);
            if ($.inArray(key, toMap) !== -1) {
               return false;
            }
            if (target !== null && !isChangeOrder && !target.get(this._options.hierField + '@')) {
               return false;
            }
         }

         return true;
      },
      /**
       *
       * @param parentKey
       * @returns {Array}
       * @private
       */
      _getParentsMap: function(parentKey) {
         var
            recordSet = this.getItems(),
         /*
          TODO: проверяем, что не перемещаем папку саму в себя, либо в одного из своих детей.
          В текущей реализации мы можем всего-лишь из метаданных вытащить путь от корня до текущего открытого раздела.
          Это костыль, т.к. мы расчитываем на то, что БЛ при открытии узла всегда вернет нам путь до корня.
          Решить проблему можно следующими способами:
          1. во первых в каталоге номенклатуры перемещение сделано не по стандарту. при нажатии в операциях над записью кнопки "переместить" всегда должен открываться диалог выбора папки. сейчас же они без открытия диалога сразу что-то перемещают и от этого мы имеем проблемы. Если всегда перемещать через диалог перемещения, то у нас всегда будет полная иерархия, и мы сможем определять зависимость между двумя узлами, просто пройдясь вверх по иерархии.
          2. тем не менее это не отменяет сценария обычного Ctrl+C/Ctrl+V. В таком случае при операции Ctrl+C нам нужно запоминать в метаданные для перемещения текущую позицию иерархии от корня (если это возможно), чтобы в будущем при вставке произвести анализ на корректность операции
          3. это не исключает ситуации, когда БЛ не возвращает иерархию до корня, либо пользователь самостоятельно пытается что-то переместить с помощью интерфейса IDataSource.move. В таком случае мы считаем, что БЛ вне зависимости от возможности проверки на клиенте, всегда должна проверять входные значения при перемещении. В противном случае это приводит к зависанию запроса.
          */
            path = recordSet.getMetaData().path,
            toMap = [];
         if (recordSet.getMetaData().path) {
            path.each(function (elem) {
               toMap.push('' + elem.getId());
            });
         }
         var record = recordSet.getRecordById(parentKey);
         while (record) {
            parentKey = '' + record.getId();
            if ($.inArray(parentKey, toMap) === -1) {
               toMap.push(parentKey);
            }
            parentKey = record.get(this._options.hierField);
            record = recordSet.getRecordById(parentKey);
         }
         return toMap;
      }
      //endregion checkmove
   });
   Di.register('listview.mover', Mover);
   return Mover;
});