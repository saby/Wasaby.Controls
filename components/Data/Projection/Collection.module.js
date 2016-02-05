/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Collection', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Projection.ICollection',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem'
], function (IEnumerable, ICollectionProjection, IBindCollectionProjection, CollectionProjectionEnumerator, Projection) {
   'use strict';

   /**
    * Проекция коллекции - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @class SBIS3.CONTROLS.Data.Projection.Collection
    * @extends SBIS3.CONTROLS.Data.Projection.Projection
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Projection.ICollection
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollectionProjection
    * @ignoreMethods notifyItemChange
    * @public
    * @author Мальцев Алексей
    */

   var CollectionProjection = Projection.extend([IEnumerable, ICollectionProjection, IBindCollectionProjection], /** @lends SBIS3.CONTROLS.Data.Projection.Collection.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Collection',
      $protected: {
         /**
          * @member {String} Модуль элемента проекции
          */
         _itemModule: 'SBIS3.CONTROLS.Data.Projection.CollectionItem',

         /**
          * @member {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} Индекс проекции коллекции
          */
         _itemsMap: [],

         /**
          * @member {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator} Служебный энумератор проекции - для отслеживания текущего элемента и поиска по свойствам
          */
         _serviceEnumerator: undefined,

         /**
          * @member {Function(*, Number} Фильтр элементов проекции
          */
         _filter: undefined,

         /**
          * @member {Array.<Boolean>} Результат применения фильтра
          */
         _filterMap: [],

         /**
          * @member {Function} Метод группировки элементов проекции
          */
         _group: undefined,

         /**
          * @member {Array.<Function>} Метод сортировки элементов проекции
          */
         _sort: [],

         /**
          * @member {Array.<Number>} Результат применения сортировки
          */
         _sortMap: [],

         /**
          * @member {Function} Обработчик события об изменении исходной коллекции
          */
         _onSourceCollectionChange: undefined,

         /**
          * @member {Function} Обработчик события об изменении элемента исходной коллекции
          */
         _onSourceCollectionItemChange: undefined
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         this._publish('onCurrentChange', 'onCollectionChange', 'onCollectionItemChange');

         if ('itemModule' in cfg) {
            this._itemModule = cfg.itemModule;
         }
         if ('convertToItem' in cfg) {
            this._convertToItem = cfg.convertToItem;
         }
         if (!this._options.collection) {
            throw new Error('Source collection is undefined');
         }
         if (!$ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new Error('Source collection should implement SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         this._init();
         this._bindHandlers();
         if ($ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Bind.ICollection')) {
            this.subscribeTo(this._options.collection, 'onCollectionChange', this._onSourceCollectionChange);
            this.subscribeTo(this._options.collection, 'onCollectionItemChange', this._onSourceCollectionItemChange);
         }
      },

      destroy: function () {
         if ($ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Bind.ICollection')) {
            this.unsubscribeFrom(this._options.collection, 'onCollectionChange', this._onSourceCollectionChange);
            this.unsubscribeFrom(this._options.collection, 'onCollectionItemChange', this._onSourceCollectionItemChange);
         }

         this._serviceEnumerator = undefined;

         CollectionProjection.superclass.destroy.call(this);
      },

      //region mutable

      /**
       * Возвращает элемент проекции с указанным хэшем
       * @param {String} hash Хеш элемента
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @state mutable
       */
      getByHash: function(hash) {
         return this.at(
            this._getServiceEnumerator().getIndexByValue('hash', hash)
         );
      },

      /**
       * Возвращает индекс элемента проекции с указанным хэшем
       * @param {String} hash Хеш элемента
       * @returns {Number}
       * @state mutable
       */
      getIndexByHash: function (hash) {
         return this._getServiceEnumerator().getIndexByValue('hash', hash);
      },

      /**
       * Возвращает элемент по индексу
       * @param {Number} index Индекс
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @state mutable
       */
      at: function (index) {
         return this._getServiceEnumerator().at(index);
      },

      /**
       * Возвращает индекс элемента
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Элемент
       * @returns {Number}
       * @state mutable
       */
      getIndex: function (item) {
         return this.getIndexByHash(item.getHash());
      },

      /**
       * Возвращает кол-во элементов проекции
       * @returns {Number}
       * @state mutable
       */
      getCount: function () {
         return $ws.helpers.reduce(this._filterMap, function(prev, current) {
            return prev + (current ? 1 : 0);
         }, 0);
      },

      //endregion mutable

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов проекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator}
       */
      getEnumerator: function () {
         return new CollectionProjectionEnumerator({
            itemsMap: this._itemsMap,
            filterMap: this._filterMap,
            sortMap: this._sortMap
         });
      },

      each: function (callback, context) {
         var enumerator = this.getEnumerator(),
            index = 0,
            item;
         while ((item = enumerator.getNext())) {
            callback.call(context, item, index++);
         }
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Projection.ICollection

      getCollection: function () {
         return this._options.collection;
      },

      getCurrent: function () {
         return this._getServiceEnumerator().getCurrent();
      },

      setCurrent: function (item, silent) {
         var oldCurrent = this.getCurrent();
         if (oldCurrent !== item) {
            var oldPosition = this.getCurrentPosition();
            this._getServiceEnumerator().setCurrent(item);
            if (!silent) {
               this._notifyCurrentChange(
                  this.getCurrent(),
                  oldCurrent,
                  this._getServiceEnumerator().getPosition(),
                  oldPosition
               );
            }
         }
      },

      getCurrentPosition: function () {
         return this._getServiceEnumerator().getPosition();
      },

      setCurrentPosition: function (position, silent) {
         var oldPosition = this.getCurrentPosition();
         if (position !== oldPosition) {
            var oldCurrent = this.getCurrent();
            this._getServiceEnumerator().setPosition(position);
            if (!silent) {
               this._notifyCurrentChange(
                  this.getCurrent(),
                  oldCurrent,
                  position,
                  oldPosition
               );
            }
         }
      },

      moveToNext: function () {
         var oldCurrent = this.getCurrent(),
             oldCurrentPosition = this.getCurrentPosition(),
             hasNext = this._getServiceEnumerator().getNext() ? true : false;
         if (hasNext) {
            this._notifyCurrentChange(
               this.getCurrent(),
               oldCurrent,
               this.getCurrentPosition(),
               oldCurrentPosition
            );
         }
         return hasNext;
      },

      moveToPrevious: function () {
         var oldCurrent = this.getCurrent(),
             oldCurrentPosition = this.getCurrentPosition(),
             hasPrevious = this._getServiceEnumerator().getPrevious() ? true : false;
         if (hasPrevious) {
            this._notifyCurrentChange(
               this.getCurrent(),
               oldCurrent,
               this.getCurrentPosition(),
               oldCurrentPosition
            );
         }
         return hasPrevious;
      },

      moveToFirst: function () {
         if (this.getCurrentPosition() === 0) {
            return false;
         }
         this.setCurrentPosition(0);
         return this._getServiceEnumerator().getPosition() === 0;
      },

      moveToLast: function () {
         var position = this.getCount() - 1;
         if (this.getCurrentPosition() === position) {
            return false;
         }
         this.setCurrentPosition(position);
         return this.getCurrentPosition() === position;
      },

      getFilter: function () {
         return this._filter;
      },

      setFilter: function (filter) {
         if (this._filter === filter) {
            return;
         }
         this._filter = filter;
         this._reFilter();
      },

      getGroup: function () {
         return this._group;
      },

      setGroup: function (group) {
         this._group = group;
         //TODO: implement it
         throw new Error('setGroup() is under construction');
      },

      getSort: function () {
         return this._sort.length > 1 ? this._sort : this._sort[0];
      },

      setSort: function () {
         if (this._sort.length === arguments.length) {
            var changed = false;
            for (var i = 0; i < arguments.length; i++) {
               if (this._sort[i] !== arguments[i]) {
                  changed = true;
               }
            }

            if (!changed) {
               return;
            }
         }

         this._sort = $ws.helpers.filter(Array.prototype.slice.call(arguments), function(item) {
            return typeof item === 'function';
         });

         this._reSort();
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region Public methods

      /**
       * Уведомляет подписчиков об изменении элемента коллекции
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Элемент проекции
       * @param {String} property Изменившееся свойство
       */
      notifyItemChange: function (item, property) {
         this._notify(
            'onCollectionItemChange',
            item,
            this.getCollection().getIndex(item.getContents()),
            property
         );
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Инициализирует проекцию
       * @protected
       */
      _init: function () {
         this._reBuild();
      },

      /**
       * Настраивает контекст обработчиков
       * @protected
       */
      _bindHandlers: function() {
         this._onSourceCollectionChange = onSourceCollectionChange.bind(this);
         this._onSourceCollectionItemChange = onSourceCollectionItemChange.bind(this);
      },

      _unbindHandlers: function() {
      },

      /**
       * Превращает объект в элемент коллекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator}
       * @protected
       */
      _getServiceEnumerator: function () {
         return this._serviceEnumerator || (this._serviceEnumerator = this.getEnumerator());
      },

      /**
       * Превращает объект в элемент коллекции
       * @param {*} item Объект
       * @param {Number} index Индекс объекта
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @protected
       */
      _convertToItem: function (item) {
         return $ws.single.ioc.resolve(this._itemModule, {
            owner: this,
            contents: item
         });
      },

      /**
       * Перерасчитывает все показатели (сортировка при этом сбрасывается)
       * @protected
       */
      _reBuild: function () {
         this._itemsMap.length = 0;
         this._filterMap.length = 0;
         this._sortMap.length = 0;

         var enumerator = this._options.collection.getEnumerator(),
            index = -1,
            item;
         while ((item = enumerator.getNext())) {
            index++;
            this._itemsMap.push(this._convertToItem(item));
            this._filterMap.push(true);
         }

         this._getServiceEnumerator().reIndex();
      },

      /**
       * Производит фильтрацию для среза элементов
       * @param {Number} [start=0] Начальный индекс
       * @param {Number} [count] Кол-во элементов (по умолчанию - все элементы)
       * @param {Boolean} [silent=false] Не генерировать события
       * @protected
       */
      _reFilter: function (start, count, silent) {
         start = start || 0;
         count = count || this._itemsMap.length - start;

         var enumerator = this._getServiceEnumerator(),
             finish = start + count,
             item,
             match,
             oldMatch;
         for (var index = start; index < finish; index++) {
            item = this._itemsMap[index];
            match = !this._filter || this._filter(item.getContents(), index);
            oldMatch = this._filterMap[index];

            if (match !== oldMatch) {
               if (match) {
                  this._filterMap[index] = match;
                  enumerator.reIndex();
                  if (!silent) {
                     this._notifyCollectionChange(
                        IBindCollectionProjection.ACTION_ADD,
                        [item],
                        enumerator.getInternalBySource(index),
                        [],
                        0
                     );
                  }
               } else if (oldMatch !== undefined) {
                  if (!silent) {
                     this._notifyCollectionChange(
                        IBindCollectionProjection.ACTION_REMOVE,
                        [],
                        0,
                        [item],
                        enumerator.getInternalBySource(index)
                     );
                  }
                  this._filterMap[index] = match;
                  this._getServiceEnumerator().reIndex();
               }
            }
         }
      },

      /**
       * Производит сортировку элементов
       * @param {Boolean} [silent=false] Не генерировать события
       * @protected
       */
      _reSort: function (silent) {
         //Проверяем, есть ли смысл сортировать
         if (!this._isSorted() && !this._sortMap.length) {
            return;
         }

         var getIndexes = function(arr) {
               return $ws.helpers.map(arr, function(item, index) {
                  return index;
               });
            },
            oldSortMap = this._sortMap.length ? this._sortMap.slice() : getIndexes(this._itemsMap),
            newSortMap,
            index,
            count;

         this._sortMap.length = 0;
         if (this._isSorted()) {
            //Создаем служебный массив
            var items = [];

            for (index = 0, count = this._itemsMap.length; index < count; index++) {
               items.push({
                  item: this._itemsMap[index].getContents(),
                  index: index,
                  collectionIndex: index
               });
            }

            //Выполняем сортировку служебного массива
            for (var i = this._sort.length - 1; i >= 0; i--) {
               items.sort(this._sort[i]);
            }

            //Заполняем индекс сортировки по служебному массиву
            for (index = 0, count = items.length; index < count; index++) {
               this._sortMap.push(items[index].collectionIndex);
            }
            newSortMap = this._sortMap;
         } else {
            newSortMap = getIndexes(this._itemsMap);
         }

         this._getServiceEnumerator().reIndex();

         if (!silent) {
            //Анализируем новый порядок элементов - идем по новому индексу сортировки и сопоставляем ее со старой.
            //Если на очередной позиции находится не тот элемент, то ищем его старую позицию и перемещаем на новую
            var newIndex,
               oldIndex,
               sourceIndex;
            for (newIndex = 0, count = newSortMap.length; newIndex < count; newIndex++) {
               if (newSortMap[newIndex] === oldSortMap[newIndex]) {
                  continue;
               }

               //ищем
               sourceIndex = newSortMap[newIndex];
               oldIndex = Array.indexOf(oldSortMap, sourceIndex);

               //перемещаем в старом индексе
               oldSortMap.splice(oldIndex, 1);
               oldSortMap.splice(newIndex + (oldIndex > newIndex ? 0 : 1), 0, sourceIndex);

               //уведомляем о перемещении
               this._notify(
                  'onCollectionChange',
                  IBindCollectionProjection.ACTION_MOVE,
                  [this._itemsMap[sourceIndex]],
                  newIndex,
                  [this._itemsMap[sourceIndex]],
                  oldIndex
               );
            }
         }
      },

      /**
       * Добавляет в индекс сортировки элементы
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} count Кол-во элементов
       * @protected
       */
      _addToSortMap: function (start, count) {
         if (!this._isSorted()) {
            return;
         }
         start = start || 0;
         count = count || 0;

         for (var index = start, finsih = start + count; index < finsih; index++) {
            this._sortMap.push(index);
         }
      },

      /**
       * Удаляет из индекса сортировки срез элементов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} count Кол-во элементов
       * @protected
       */
      _removeFromSortMap: function (start, count) {
         if (!this._isSorted()) {
            return;
         }
         start = start || 0;
         count = count || 0;
         var finish = start + count,
             index;

         for (index = start; index < finish; index++) {
            var at = Array.indexOf(this._sortMap, index);
            if (at > -1) {
               this._sortMap.splice(at, 1);
            }
         }

         for (index = 0; index < this._sortMap.length; index++) {
            if (this._sortMap[index] >= start) {
               this._sortMap[index] -= count;
            }
         }
      },

      /**
       * Проверяет, что исходная коллекция искажается
       * @returns {Boolean}
       * @protected
       */
      _isFalseMirror: function () {
         return this._isFiltered() || this._isSorted();
      },

      /**
       * Проверяет, что используется фильтрация
       * @returns {Boolean}
       * @protected
       */
      _isFiltered: function () {
         return !!this._filter;
      },

      /**
       * Проверяет, что используется сортировка
       * @returns {Boolean}
       * @protected
       */
      _isSorted: function () {
         return this._sort.length > 0;
      },

      /**
       * Дробавляет срез элементов в индексы
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} items Элементы
       * @protected
       */
      _addItems: function (start, items) {
         var isFalseMirror = this._isFalseMirror();
         Array.prototype.splice.apply(this._itemsMap, [start, 0].concat(
            $ws.helpers.map(items, (function(item) {
               return this._convertToItem(item);
            }), this)
         ));
         Array.prototype.splice.apply(this._filterMap, [start, 0].concat($ws.helpers.map(items, function() {
            return !isFalseMirror;
         })));
         this._addToSortMap(start, items.length);
      },

      /**
       * Удаляет срез элементов из индексов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} [count] Кол-во элементов
       * @protected
       */
      _removeItems: function (start, count) {
         start = start || 0;
         count = count === undefined ? this._sortMap.length - start : count;

         this._itemsMap.splice(start, count);
         this._filterMap.splice(start, count);
         this._removeFromSortMap(start, count);
      },

      /**
       * Заменяет элементы в индексах
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} items Новые элементы
       * @returns {Array} Замененные элементы
       * @protected
       */
      _replaceItems: function (start, items) {
         var replaced = [],
            item;
         for (var i = 0, count = items.length; i < count; i++) {
            item = this._itemsMap[start + i];
            if (item) {
               replaced.push(item.getContents());
               item.setContents(items[i], true);
            } else {
               $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Projection.Collection::_replaceItems', 'Item for replace is not exists');
            }
         }
         return replaced;
      },

      /**
       * Возвращает срез элементов коллекции в соответствии с примененными сортировкой и фильтром
       * @param {Array} items Элементы исходной коллеции
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Boolean} [newContainers=false] Создать новые контейнеры (потому что в старых уже другие элементы)
       * @returns {Array.<SBIS3.CONTROLS.Data.Projection.ICollectionItem>}
       * @protected
       */
      _getItemsProjection: function (items, start, newContainers) {
         if (!this._isFalseMirror()) {
            if (newContainers) {
               return $ws.helpers.map(items, (function(item) {
                  return this._convertToItem(item);
               }), this);
            } else {
               return this._itemsMap.slice(start, start + items.length);
            }
         }

         var result = [],
            index,
            itemIndex;
         for (var i = 0, count = items.length; i < count; i++) {
            index = i + start;
            itemIndex = this._isSorted() ? this._sortMap[index] : index;
            if (!this._isFiltered() || this._filterMap[index]) {
               if (newContainers) {
                  result.push(this._convertToItem(items[i]));
               } else {
                  result.push(this._itemsMap[itemIndex]);
               }
            }
         }

         return result;
      },

      /**
       * Обработчик события об изменении исходной коллекции
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.ICollectionItem>} newItems Новые элементы исходной коллеции.
       * @param {Number} newItemsIndex Индекс исходной коллеции, в котором появились новые элементы.
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.ICollectionItem>} oldItems Удаленные элементы исходной коллеции.
       * @param {Number} oldItemsIndex Индекс исходной коллеции, в котором удалены элементы.
       * @protected
       */
      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (newItems.length || oldItems.length) {
            this._notify(
               'onCollectionChange',
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
         }
      },

      /**
       * Генерирует событие об изменении текущего элемента проекции коллекции
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       * @protected
       */
      _notifyCurrentChange: function (newCurrent, oldCurrent, newPosition, oldPosition) {
         this._notify(
            'onCurrentChange',
            newCurrent,
            oldCurrent,
            newPosition,
            oldPosition
         );
      }

      //endregion Protected methods

   });

   /**
    * Обрабатывает событие об изменении исходной коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {*[]} newItems Новые элементы коллеции.
    * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {*[]} oldItems Удаленные элементы коллекции.
    * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
    * @private
    */
   var onSourceCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      var notifyStandard = (function() {
         this._notifyCollectionChange(
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
         );
      });

      switch (action) {
         case IBindCollectionProjection.ACTION_ADD:
            this._addItems(newItemsIndex, newItems);
            this._getServiceEnumerator().reIndex();
            if (this._isSorted()) {
               this._reFilter(newItemsIndex, newItems.length);
               this._reSort();
            } else {
               this._reFilter(newItemsIndex, newItems.length, true);
               newItems = this._getItemsProjection(newItems, newItemsIndex);
               oldItems = this._getItemsProjection(oldItems, oldItemsIndex);
               notifyStandard.call(this);
            }
            break;

         case IBindCollectionProjection.ACTION_REMOVE:
            newItems = this._getItemsProjection(newItems, newItemsIndex);
            oldItems = this._getItemsProjection(oldItems, oldItemsIndex);
            this._removeItems(oldItemsIndex, oldItems.length);
            notifyStandard.call(this);
            this._getServiceEnumerator().reIndex();
            break;

         case IBindCollectionProjection.ACTION_REPLACE:
            if (this._isFalseMirror()) {
               this._removeItems(oldItemsIndex, oldItems.length);
               this._reSort();

               this._addItems(newItemsIndex, newItems);
               this._reFilter(newItemsIndex, newItems.length);
               this._reSort();
            } else {
               this._replaceItems(newItemsIndex, newItems);
               newItems = this._getItemsProjection(newItems, newItemsIndex);
               oldItems = this._getItemsProjection(oldItems, oldItemsIndex, true);
               notifyStandard.call(this);
            }
            this._getServiceEnumerator().reIndex();
            break;

         case IBindCollectionProjection.ACTION_MOVE:
            this._removeItems(oldItemsIndex, oldItems.length);
            this._addItems(newItemsIndex, newItems);
            if (this._isSorted()) {
               this._reSort();
            } else {
               newItems = this._getItemsProjection(newItems, newItemsIndex);
               oldItems = this._getItemsProjection(oldItems, oldItemsIndex);
               notifyStandard.call(this);
            }
            this._getServiceEnumerator().reIndex();
            break;

         case IBindCollectionProjection.ACTION_RESET:
            oldItems = this._getItemsProjection(oldItems, oldItemsIndex);
            this._reBuild();
            this._reFilter(newItemsIndex, newItems.length, true);
            newItems = this._getItemsProjection(newItems, newItemsIndex);
            notifyStandard.call(this);
            this._getServiceEnumerator().reIndex();
            break;
      }
   },

   /**
    * Обрабатывает событие об изменении элемента исходной коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {*} item Измененный элемент коллеции.
    * @param {Integer} index Индекс измененного элемента.
    * @param {String} [property] Измененное свойство элемента
    * @private
    */
   onSourceCollectionItemChange = function (event, item, index) {
      this._notify(
         'onCollectionItemChange',
         this._itemsMap[index],
         this._getServiceEnumerator().getInternalBySource(index),
         'contents'
      );
      this._reFilter(index, 1);
      this._reSort();
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.Collection', function(config) {
      return new CollectionProjection(config);
   });

   return CollectionProjection;
});
