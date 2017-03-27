/*global define, $*/
define('js!SBIS3.CONTROLS.ListView.Mover', [
   'js!WS.Data/Di',
   "Core/core-instance",
   "Core/Deferred",
   "Core/Abstract",
   'js!WS.Data/Utils',
   'js!WS.Data/Source/ISource'

], function (Di, cInstance, Deferred, Abstract, Utils, ISource) {
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
             * @deprecated для внедрения своей логики используйте события onBeginMove, onEndMove
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
            nodeProperty: null,
            /**
             * @cfg {WS.Data/Source/ISource} источник данных.
             */
            dataSource: undefined
         }
      },
      $constructor: function (cfg) {
         cfg = cfg || {};
         this._publish('onBeginMove', 'onEndMove');
         if (cfg.moveStrategy) {
            Utils.logger.stack(this._moduleName + 'MoveStrategy have deprecated, and will be removed in 3.8.0, please use events onBeginMove or onEndMove on ListView instead of MoveStrategy', 1);
         }
      },
      //region for_controls
      moveRecordDown: function(record) {
         this._moveToOneRow(record, 'after');
      },

      moveRecordUp: function(record) {
         this._moveToOneRow(record, 'before');
      },

      getItems: function(){
         return this._options.items;
      },

      _moveToOneRow: function(record, position) {
         var projection = this.getProjection(),
            item = projection.getItemBySourceItem(record),
            targetItem = position == 'after' ? projection.getNext(item) : projection.getPrevious(item);
         if(targetItem) {
            this.move([record], targetItem.getContents(), position);
         }
      },

      getProjection: function() {
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
            def;
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

         if (target !== null && !cInstance.instanceOfModule(target, 'WS.Data/Entity/Model')) {
            target = this.getItems().getRecordById(target);
         }

         if (this._checkRecordsForMove(movedItems, target, isChangeOrder)) {
            var
               moveStrategy = this.getMoveStrategy();
            if (moveStrategy) {
               //todo поддерживаем стратегии перемещения, потом убрать
               if (isChangeOrder) { 
                  result = moveStrategy.move(movedItems, target, position == 'after');
               } else {
                  result = moveStrategy.hierarchyMove(movedItems, target);
               }
            } else {
               var result = this._notify('onBeginMove', movedItems, target, position);
               if (result instanceof Deferred) {
                  result.addCallback(function (result) {
                     this._move(movedItems, target, position, result);
                  }.bind(this));
               } else {
                  result = this._move(movedItems, target, position, result);
               }
            }
         }
         return (result instanceof Deferred) ? result : new Deferred().callback(result);
      },

      _move: function (movedItems, target, position, result) {
         if (result == Mover.ON_BEGIN_MOVE_RESULT.MOVE_IN_ITEMS) {
            this.moveInItems(movedItems, target, position);
         } else if (result !== Mover.ON_BEGIN_MOVE_RESULT.CUSTOM) {
            return this._callMoveMethod(movedItems, target, position, result).addCallback(function (result) {
               this.moveInItems(movedItems, target, position);
               return result;
            }.bind(this)).addBoth(function (result) {
               this._notify('onEndMove', result, movedItems, target, position);
               return result;
            }.bind(this));
         } else {
            this._notify('onEndMove', undefined, movedItems, target, position);
         }
         return result;
      },
      //endregion for_controls
      //region move_strategy
      /**
       * Возвращает стратегию перемещения
       * @deprecated для внедрения своей логики используйте события onBeginMove, onEndMove
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @returns {WS.Data/MoveStrategy/IMoveStrategy}
       */
      getMoveStrategy: function() {
         return this._options.moveStrategy;
      },
      /**
       * Устанавливает стратегию перемещения
       * @deprecated для внедрения своей логики используйте события onBeginMove, onEndMove
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @param {WS.Data/MoveStrategy/IMoveStrategy} strategy - стратегия перемещения
       */
      setMoveStrategy: function (moveStrategy) {
         this._options.moveStrategy = strategy;
      },

      /**
       * Вызывает метод перемещения на источнике данных
       * @param movedItems
       * @param target
       * @param position
       * @returns {*|$ws.proto.Deferred}
       * @private
       */
      _callMoveMethod: function(movedItems, target, position, result) {
         if (result !== Mover.ON_BEGIN_MOVE_RESULT.MOVE_IN_ITEMS) {
            var
               idArray = [];
            movedItems.forEach(function (item) {
               if (cInstance.instanceOfModule(item, 'WS.Data/Entity/Model')) {
                  idArray.push(item.getId());
               } else {
                  idArray.push(item);
               }
            });
            var dataSource = this._getDataSource();
            if (dataSource) {
               return dataSource.move(
                  idArray,
                  target === null ? null : target.getId(), {
                     position: position,
                     parentProperty: this._options.parentProperty,
                     nodeProperty: this._options.nodeProperty
                  }
               );
            }
         }
         return new Deferred().callback(result);
      },

      /**
       * Возвращает источник данных
       * @returns {*}
       * @private
       */
      _getDataSource: function() {
         if (this._options.dataSource) {
            return this._options.dataSource;
         } else if (this._options.listView) {
            return this._options.listView.getDataSource();
         }
      },
      /**
       * Перемещает записи в связанной коллекции.
       * @param movedItems
       * @param target
       * @param position
       */
      moveInItems: function(movedItems, target, position) {
         var items = this.getItems();
         if (items) {
            movedItems.forEach(function (movedItem) {
               if (position !== 'on') {
                  if (this._options.parentProperty) {
                     //если перемещение было по порядку и иерархии одновременно, то надо обновить parentProperty
                     movedItem.set(this._options.parentProperty, target.get(this._options.parentProperty));
                  }
                  var itemsIndex = items.getIndex(movedItem),
                     targetIndex = items.getIndex(target);
                  if (position == ISource.MOVE_POSITION.after) {
                     targetIndex = (targetIndex + 1) < items.getCount() ? ++targetIndex : items.getCount();
                  } else {
                     targetIndex = (targetIndex - 1) > -1 ? targetIndex : 0;
                  }
                  if (itemsIndex !== -1 && itemsIndex < targetIndex && targetIndex > 0) {
                     targetIndex--; //если запись по списку сдвигается вниз то после ее удаления индексы сдвинутся
                  }
                  items.setEventRaising(false, true);
                  items.remove(movedItem);
                  items.add(
                     movedItem,
                     targetIndex < items.getCount() ? targetIndex : undefined
                  );
                  items.setEventRaising(true, true);
               } else if(this._options.parentProperty) {
                  movedItem.set(this._options.parentProperty, target ? target.getId() : null);
               }
            }.bind(this));
         }
      },
      //endregion move_strategy
      //region checkmove
      /**
       * Проверяет можно ли перенести элементы
       * @param {Array} movedItems Массив перемещаемых элементов
       * @param {WS.Data/Entity/Record} target рекорд к которому надо переместить
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

         if (this._options.parentProperty) {
            if (target !== null) {
               if (this._options.nodeProperty && !isChangeOrder && target.get(this._options.nodeProperty) === null) {
                  return false;
               }
               toMap = this._getParentsMap(target.getId());
            }
            for (var i = 0; i < movedItems.length; i++) {
               key = '' + (cInstance.instanceOfModule(movedItems[i], 'WS.Data/Entity/Model') ? movedItems[i].getId() : movedItems[i]);
               if (toMap.indexOf(key) !== -1) {
                  return false;
               }
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
   Mover.ON_BEGIN_MOVE_RESULT = { // Возможные результаты события "BeginEditResult"
      CUSTOM: 'Custom', //Своя логика перемещения записей
      MOVE_IN_ITEMS: 'MoveInItems'//Переместить в списке без вызова перемещения на источнике
   };

   return Mover;
});