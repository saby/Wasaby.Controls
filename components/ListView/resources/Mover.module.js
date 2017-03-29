/*global define, $*/
define('js!SBIS3.CONTROLS.ListView.Mover', [
   'js!WS.Data/Di',
   "Core/core-instance",
   "Core/Deferred",
   "Core/Abstract",
   "Core/IoC"
], function (Di, cInstance, Deferred, Abstract, IoC) {
   'use strict';
   /**
    * Перемещает элементы
    * @class SBIS3.CONTROLS.ListView.Mover
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
            /**
             * @cfg {WS.Data/Display/Display} Проекция элементов.
             */
            projection: undefined,
            /**
             *
             */
            /**
             * @cfg {String} Устанавливает поле иерархии, по которому будут установлены иерархические связи записей списка.
             * @remark
             * Поле иерархии хранит первичный ключ той записи, которая является узлом для текущей. Значение null - запись расположена в корне иерархии.
             * Например, поле иерархии "Раздел". Название поля "Раздел" необязательное, и в каждом случае может быть разным.
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел</option>
             * </pre>
             */
            parentProperty: null,
            /**
             * @cfg {String} Устанавливает поле в котором хранится признак типа записи в иерархии
             * @remark
             * null - лист, false - скрытый узел, true - узел
             *
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел@</option>
             * </pre>
             */
            nodeProperty: null
         }
      },
      _modifyOptions: function (cfg) {
         if (cfg.hierField) {
            IoC.resolve('ILogger').log('Mover', 'Опция hierField является устаревшей, используйте parentProperty');
            cfg.parentProperty = cfg.hierField;
         }
         if (cfg.parentProperty && !cfg.nodeProperty) {
            cfg.nodeProperty = cfg.parentProperty + '@';
         }
         return Mover.superclass._modifyOptions.apply(this, arguments);
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
       * @param {SBIS3.CONTROLS.DragEntity.List} dragSource Объект содержащий данные
       * @param {SBIS3.CONTROLS.DragEntity.Row} target Объект указывающий куда надо перенести данные
       * @param {WS.Data/Collection/RecordSet} ownerItems Рекордсет из которого переносятся данные
       * @param {Boolean} move Использовать стандартное перемещение.
       * @remark Подходит только если у контролов одинаковые источники данных.
       * @private
       */
      moveFromOutside: function(dragSource, target, ownerItems, move) {
         var operation = dragSource.getOperation(),
            action = dragSource.getAction(),
            def = false;
         if (typeof action === 'function') {
            def =  action.call(dragSource);
         } else  if (move && (operation === 'add' || operation === 'move')) {
            var movedItems = [];
            dragSource.each(function (movedItem) {
               movedItems.push(movedItem.getModel());
            });
            def = this.move(movedItems, target.getModel(), target.getPosition());
         }
         def = (def instanceof Deferred) ? def : new Deferred().callback(def);
         var position = this.getItems().getIndex(target.getModel()),
            items = this.getItems();
         position = target.getPosition() != 'after' ? position : position +1;
         def.addCallback(function(result) {
            if (result !== false) {
               dragSource.each(function(movedItem) {
                  var model = movedItem.getModel();
                  if (operation === 'add' || operation === 'move') {
                     if (cInstance.instanceOfModule(items, 'WS.Data/Collection/RecordSet')) {
                        //Если items рекордсет то при перемещении добавится клон записи и по индексу ее будет не найти
                        if (!items.getRecordById(model.getId())) {
                           items.add(model, position);
                        }
                     } else if(items.getIndex(model) === -1)  {
                        items.add(model.clone(), position);
                     }
                  }
                  if (operation === 'delete' || operation === 'move') {
                     ownerItems.remove(model);
                  }
               });
            }
            return result;
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
            result = false,
            isNodeTo = true,
            isChangeOrder = position !== 'on';

         if (!cInstance.instanceOfModule(target, 'WS.Data/Entity/Model')) {
            target = this.getItems().getRecordById(target);
         }

         if (target !== null) {
            isNodeTo = target.get(this._options.nodeProperty);
         }

         if (this._checkRecordsForMove(movedItems, target, isChangeOrder)) {
            if (isNodeTo && !isChangeOrder) {
               result = this.getMoveStrategy().hierarchyMove(movedItems, target);
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
         if (target !== null && this._options.parentProperty) {
            toMap = this._getParentsMap(target.getId());
         }
         if (movedItems.indexOf(target) !== -1) {
            return false;
         }
         for (var i = 0; i < movedItems.length; i++) {
            key = '' + (cInstance.instanceOfModule(movedItems[i], 'WS.Data/Entity/Model') ? movedItems[i].getId() : movedItems[i]);
            if (toMap.indexOf(key) !== -1) {
               return false;
            }
            if (target !== null && !isChangeOrder && !target.get(this._options.nodeProperty)) {
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
            if (toMap.indexOf(parentKey) === -1) {
               toMap.push(parentKey);
            }
            parentKey = record.get(this._options.parentProperty);
            record = recordSet.getRecordById(parentKey);
         }
         return toMap;
      }
      //endregion checkmove
   });
   Di.register('listview.mover', Mover);
   return Mover;
});