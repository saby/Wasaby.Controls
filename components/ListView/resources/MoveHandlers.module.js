/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.MoveHandlers', [
   'js!SBIS3.CORE.Dialog',
   'js!WS.Data/MoveStrategy/Sbis',
   'js!WS.Data/MoveStrategy/Base',
   'js!SBIS3.CONTROLS.Action.List.InteractiveMove',
   'js!WS.Data/Di',
   'i18n!SBIS3.CONTROLS.MoveHandlers',
   'js!WS.Data/MoveStrategy/Sbis'
], function(Dialog, SbisMoveStrategy, BaseMoveStrategy, InteractiveMove, Di) {
   /**
    * Контрол, отображающий набор однотипных сущностей. Позволяет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать.
    * Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/">Настройка списков</a>.
    *
    * @mixin SBIS3.CONTROLS.MoveHandlers
    * @author Крайнов Дмитрий Олегович
    *
    * @public
    */
   var MoveHandlers = {
      $protected: {
        _options: {
           moveStrategy: undefined
        },
        _moveStrategy: undefined
      },

      after: {
         _endDragHandler: function(dragObject){
            var  target = dragObject.getTarget();
            if (target) {
               if (target.getModel().getId() == this.getSelectedKey()) {
                  //TODO придрот для того, чтобы если перетащить элемент сам на себя не отработал его обработчик клика
                  clickHandler = this._elemClickHandler;
                  this._elemClickHandler = function () {
                     this._elemClickHandler = clickHandler;
                  };
               }
               if (dragObject.getOwner() === this) {
                  var models = [];
                  dragObject.getSource().each(function(item){
                     models.push(item.getModel());
                  });
                  var position = target.getPosition();
                  this._move(models, target.getModel(),
                     position === 'on' ? undefined : position === 'after'
                  );
               } else {
                  this._moveFromOut(dragObject);
               }
            }
         }
      },


      //region public
      selectedMoveTo: function(moveTo) {
         var selectedItems = this.getSelectedItems(false);
         this._move(selectedItems ? selectedItems.toArray() : [], moveTo);
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
       * Устанавливает стратегию перемещения
       * @see WS.Data/MoveStrategy/IMoveStrategy
       * @param {WS.Data/MoveStrategy/IMoveStrategy} strategy - стратегия перемещения
       */
      setMoveStrategy: function (strategy){
         if(!$ws.helpers.instanceOfMixin(strategy,'WS.Data/MoveStrategy/IMoveStrategy')){
            throw new Error('The strategy must implemented interfaces the WS.Data/MoveStrategy/IMoveStrategy.')
         }
         this._moveStrategy = strategy;
      },
      /**
       * Обработчик для операции над записью, переместить ввниз
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
       * Обработчик для операции над записью, переместить вверх
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
      //endregion public
      //region protected
      /**
       * перемещает записи в коллекции
       * @param movedItems
       * @param target
       * @param after
       */
      moveInItems: function(movedItems, target, after) {
         var movedItemIndex,
            items = this.getItems(),
            projection = this._getItemsProjection(),
            orderPropery = this.getDataSource().getOrderProperty(),
            orderValue = this._getOrderValue(movedItems[0], target, after);

         $ws.helpers.forEach(movedItems, function(movedItem) {
            var projectionItem =  projection.getItemBySourceItem(movedItem);
            if (this._options.hierField) {
               //если перемещение было по порядку и иерархии одновременно, то надо обновить hierField
               movedItem.set(this._options.hierField, target.get(this._options.hierField));
            }
            if (after) { //Если перемещаем вверх то надо вставить перемещаемую запись перед записью к которой перемещаем.
               var nextProjectionItem = projection.getNext(
                  projection.getItemBySourceItem(target)
               );
               if (nextProjectionItem) {
                  movedItemIndex = projection.getSourceIndexByItem(nextProjectionItem);
               } else { //если не найден то вставляем в конец
                  movedItemIndex = items.getCount();
               }
            } else {
               movedItemIndex = items.getIndex(target);
               movedItemIndex = movedItemIndex > -1 ?  movedItemIndex : 0;//если не нашли то всталяем вначало
            }
            if (items.getIndex(movedItem) < movedItemIndex ) {
               movedItemIndex--; //если запись по списку сдвигается вниз то после ее удаления индексы сдвинутся
            }
            items.setEventRaising(false, true);
            items.remove(movedItem);
            items.add(
               movedItem,
               movedItemIndex < items.getCount() ? movedItemIndex : undefined
            );
            if (orderPropery && orderValue && movedItem.has(orderPropery)) {
               movedItem.set(orderPropery, orderValue);
            }
            items.setEventRaising(true, true);
         }.bind(this));
      },
      /**
       * Вычисляет значение порномера, нужно если есть сортировка по порномеру на проекции
       * @private
       */
      _getOrderValue: function(movedItem, target, after) {
         var projection = this._getItemsProjection(),
            nearbyItemprojItem = projection[after ? 'getNext' : 'getPrevious'](
               projection.getItemBySourceItem(movedItem)
            ),
            nearbyItem =  nearbyItemprojItem ? nearbyItemprojItem.getContents() : undefined,
            orderPropery = this.getDataSource().getOrderProperty();

         if (target.has(orderPropery)) {
            var nearbyVal = nearbyItem ? nearbyItem.get(orderPropery) : undefined,
               moveToVal = target.get(orderPropery);

            if (nearbyVal && moveToVal) {
               return Math.floor((moveToVal+nearbyVal)/2);
            }
            return moveToVal;
         }
         return undefined;
      },
      /**
       * Перемещает элементы из внешнего контрола, через drag'n'drop
       * @param {SBIS3.CONTROLS.DragObject} dragObject
       * @private
       */
      _moveFromOut: function(dragObject) {
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
            dataSource: this._dataSource,
            hierField: this._options.hierField,
            listView: this
         });
      },
      _moveRecord: function(movedItem, targetsId, after) {
         var self = this,
            target = this._options._items.getRecordById(targetsId);
         this.getMoveStrategy().move([movedItem], target, after).addCallback(function() {
            self.moveInItems([movedItem], target, after);
         }).addErrback(function(e) {
            $ws.core.alert(e.message);
         });
      },
      _move: function(movedItems, target, after) {
         var
            deferred,
            self = this,
            isNodeTo = true,
            isChangeOrder = after !== undefined;

         if (target !== null) {
            isNodeTo = target.get(this._options.hierField + '@');
         }

         if (this._checkRecordsForMove(movedItems, target, isChangeOrder)) {
            this._toggleIndicator(true);

            if (isNodeTo && !isChangeOrder) {
               deferred = this.getMoveStrategy().hierarhyMove(movedItems, target);
            } else  {
               deferred = this.getMoveStrategy().move(movedItems, target, after);
            }
            if (deferred !==false && !(deferred instanceof $ws.proto.Deferred)) {
               deferred = new $ws.proto.Deferred().callback();
            }

            if (deferred instanceof $ws.proto.Deferred) {//обновляем view если вернули true либо deferred
               deferred.addCallback(function() {
                  if (isChangeOrder) {
                     self.moveInItems(movedItems, target, after);
                  } else {
                     self.removeItemsSelectionAll();
                  }
               }).addBoth(function() {
                  self._toggleIndicator(false);
               });
            } else {
               self._toggleIndicator(false);
            }
         }
      },
      _checkRecordsForMove: function(movedItems, target, isChangeOrder) {
         var
            key,
            toMap = [];
         if (target === undefined) {
            return false;
         }
         if (target !== null && $ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.TreeMixin')) {
            toMap = this._getParentsMap(target.getId());
            for (var i = 0; i < movedItems.length; i++) {
               key = '' + (($ws.helpers.instanceOfModule(movedItems[i], 'SBIS3.CONTROLS.Record')||$ws.helpers.instanceOfModule(movedItems[i], 'WS.Data/Entity/Model')) ? movedItems[i].getId() : movedItems[i]);
               if ($.inArray(key, toMap) !== -1) {
                  return false;
               }
               if (target !== null && !isChangeOrder && !target.get(this._options.hierField + '@')) {
                  return false;
               }
            }
         }

         return true;
      },
      _getParentsMap: function(parentKey) {
         var
            dataSet = this.getItems(),
            hierField = this.getHierField(),
         /*
          TODO: проверяем, что не перемещаем папку саму в себя, либо в одного из своих детей.
          В текущей реализации мы можем всего-лишь из метаданных вытащить путь от корня до текущего открытого раздела.
          Это костыль, т.к. мы расчитываем на то, что БЛ при открытии узла всегда вернет нам путь до корня.
          Решить проблему можно следующими способами:
          1. во первых в каталоге номенклатуры перемещение сделано не по стандарту. при нажатии в операциях над записью кнопки "переместить" всегда должен открываться диалог выбора папки. сейчас же они без открытия диалога сразу что-то перемещают и от этого мы имеем проблемы. Если всегда перемещать через диалог перемещения, то у нас всегда будет полная иерархия, и мы сможем определять зависимость между двумя узлами, просто пройдясь вверх по иерархии.
          2. тем не менее это не отменяет сценария обычного Ctrl+C/Ctrl+V. В таком случае при операции Ctrl+C нам нужно запоминать в метаданные для перемещения текущую позицию иерархии от корня (если это возможно), чтобы в будущем при вставке произвести анализ на корректность операции
          3. это не исключает ситуации, когда БЛ не возвращает иерархию до корня, либо пользователь самостоятельно пытается что-то переместить с помощью интерфейса IDataSource.move. В таком случае мы считаем, что БЛ вне зависимости от возможности проверки на клиенте, всегда должна проверять входные значения при перемещении. В противном случае это приводит к зависанию запроса.
          */
            path = dataSet.getMetaData().path,
            toMap = path ? $.map(path.getChildItems(), function(elem) {
               return '' + elem;
            }) : [];
         var record = dataSet.getRecordById(parentKey);
         while (record) {
            parentKey = '' + record.getId();
            if ($.inArray(parentKey, toMap) === -1) {
               toMap.push(parentKey);
            }
            parentKey = dataSet.getParentKey(record, hierField);
            record = dataSet.getRecordById(parentKey);
         }
         return toMap;
      },
      //endregion protected
      //region deprecated
      /**
       * Перемещает записи через диалог
       * @param records
       * @deprecated Используйте SBIS3.CONTROLS.Action.List.InteractiveMove.
       */
      moveRecordsWithDialog: function(records) {
         var
            action = new InteractiveMove({
               linkedObject: this,
               parentProperty: this._options.hierField
            });

         action.execute({records: records});
      }
      //endregion deprecated
   };

   return MoveHandlers;
});