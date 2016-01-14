/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Collection', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
   'js!SBIS3.CONTROLS.Data.Projection.ICollection',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem'
], function (IEnumerable, IBindCollectionProjection, ICollectionProjection, CollectionProjectionEnumerator, ArrayEnumerator, Projection) {
   'use strict';

   /**
    * Проекция коллекции - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @class SBIS3.CONTROLS.Data.Projection.Collection
    * @extends SBIS3.CONTROLS.Data.Projection
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollectionProjection
    * @mixes SBIS3.CONTROLS.Data.Projection.ICollection
    * @public
    * @author Мальцев Алексей
    */

   var CollectionProjection = Projection.extend([IBindCollectionProjection, ICollectionProjection], /** @lends SBIS3.CONTROLS.Data.Projection.Collection.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Collection',
      $protected: {
         /**
          * @var {String} Модуль элемента проекции
          */
         _itemModule: 'SBIS3.CONTROLS.Data.Projection.CollectionItem',

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.CollectionItem[]} Индекс проекции коллекции
          */
         _itemsMap: [],

         /**
          * @var {*[]} Индекс исходной коллекции
          */
         _sourceMap: [],

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator} Служебный энумератор проекции - для отслеживания текущего элемента и поиска по свойствам
          */
         _serviceEnumerator: undefined,

         /**
          * @var {Function(*, Number} Фильтр элементов проекции
          */
         _filter: undefined,

         /**
          * @var {Boolean[]} Результат применения фильтра
          */
         _filterMap: [],

         /**
          * @var {Function} Метод группировки элементов проекции
          */
         _group: undefined,

         /**
          * @var {Function[]} Метод сортировки элементов проекции
          */
         _sort: [],

         /**
          * @var {Number[]} Результат применения сортировки
          */
         _sortMap: [],

         /**
          * @var {Function} Обработчик события об изменении исходной коллекции
          */
         _onSourceCollectionChange: undefined,

         /**
          * @var {Function} Обработчик события об изменении элемента исходной коллекции
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
         return $ws.helpers.reduce(this._filterMap.reduce,function(prev, current) {
            return prev + (current ? 1 : 0);
         }, 0);
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов проекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator}
       */
      getEnumerator: function () {
         return new CollectionProjectionEnumerator({
            itemsMap: this._itemsMap,
            sourceMap: this._sourceMap,
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
         var position = this._getServiceEnumerator().getInternalBySource(this.getCollection().getCount() - 1);
         if (this.getCurrentPosition() === position) {
            return false;
         }
         this.setCurrentPosition(position);
         return this._getServiceEnumerator().getPosition() === position;
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

         this._reSort(true);
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      /**
       * Уведомляет подписчиков об изменении элемента коллекции
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Элемент проекции
       * @param {String} property Изменившееся свойство
       * @private
       */
      notifyItemChange: function (item, property) {
         this._notify(
            'onCollectionItemChange',
            item,
            this.getCollection().getIndex(item.getContents()),
            property
         );
      },

      //region Protected methods

      /**
       * Инициализирует проекцию
       * @private
       */
      _init: function () {
         this._reBuild();
      },

      /**
       * Настраивает контекст обработчиков
       * @private
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
       * @private
       */
      _getServiceEnumerator: function () {
         return this._serviceEnumerator || (this._serviceEnumerator = this.getEnumerator());
      },

      /**
       * Превращает объект в элемент коллекции
       * @param {*} item Объект
       * @param {Number} index Индекс объекта
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @private
       */
      _convertToItem: function (item) {
         return $ws.single.ioc.resolve(this._itemModule, {
            owner: this,
            contents: item
         });
      },

      /**
       * Перерасчитывает все показатели (сортировка при этом сбрасывается)
       * @private
       */
      _reBuild: function () {
         this._itemsMap.length = 0;
         this._sourceMap.length = 0;
         this._filterMap.length = 0;
         this._sortMap.length = 0;

         var enumerator = this._options.collection.getEnumerator(),
            index = -1,
            item;
         while ((item = enumerator.getNext())) {
            index++;
            this._itemsMap.push(this._convertToItem(item));
            this._sourceMap.push(item);
            this._filterMap.push(true);
         }

         this._getServiceEnumerator().reIndex();
      },

      /**
       * Производит фильтрацию для среза элементов
       * @param {Number} [start=0] Начальный индекс
       * @param {Number} [count] Кол-во элементов (по умолчанию - все элементы)
       * @private
       */
      _reFilter: function (start, count) {
         start = start || 0;
         count = count || this._sourceMap.length - start;

         var finish = start + count,
             item,
             match,
             oldMatch;
         for (var index = start; index < finish; index++) {
            item = this._sourceMap[index];
            match = !this._filter || this._filter(item, index);
            oldMatch = this._filterMap[index];

            if (match !== oldMatch) {
               if (match) {
                  this._filterMap[index] = match;
                  this._getServiceEnumerator().reIndex();
                  this._notifyCollectionChange(
                     IBindCollectionProjection.ACTION_ADD,
                     [item],
                     index,
                     [],
                     0
                  );
               } else if (oldMatch !== undefined) {
                  this._notifyCollectionChange(
                     IBindCollectionProjection.ACTION_REMOVE,
                     [],
                     0,
                     [item],
                     index
                  );
                  this._filterMap[index] = match;
                  this._getServiceEnumerator().reIndex();
               }
            }
         }
      },

      /**
       * Производит сортировку элементов
       * @param {Boolean} [notify=false] Генерировать события
       * @private
       */
      _reSort: function (notify) {
         //Проверяем, есть ли смысл сортировать
         if (!this._isSorted() && !this._sortMap.length) {
            return;
         }

         var getIndexes = function(arr) {
               return arr.map(function(item, index) {
                  return index;
               });
            },
            oldSortMap = this._sortMap.length ? this._sortMap.slice() : getIndexes(this._sourceMap),
            newSortMap,
            index,
            count;

         this._sortMap.length = 0;
         if (this._isSorted()) {
            //Создаем служебный массив
            var items = [];

            for (index = 0, count = this._sourceMap.length; index < count; index++) {
               items.push({
                  item: this._sourceMap[index],
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
            newSortMap = getIndexes(this._sourceMap);
         }

         this._getServiceEnumerator().reIndex();

         if (notify) {
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
       * @private
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
       * @private
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
       * @private
       */
      _isFalseMirror: function () {
         return this._isFiltered() || this._isSorted();
      },

      /**
       * Проверяет, что используется фильтрация
       * @returns {Boolean}
       * @private
       */
      _isFiltered: function () {
         return !!this._filter;
      },

      /**
       * Проверяет, что используется сортировка
       * @returns {Boolean}
       * @private
       */
      _isSorted: function () {
         return this._sort.length > 0;
      },

      /**
       * Дробавляет срез элементов в индексы
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} items Элементы
       * @private
       */
      _addItems: function (start, items) {
         var isFalseMirror = this._isFalseMirror();
         Array.prototype.splice.apply(this._itemsMap, [start, 0].concat(
            items.map((function(item, index) {
               return this._convertToItem(item);
            }).bind(this)))
         );
         Array.prototype.splice.apply(this._sourceMap, [start, 0].concat(items));
         Array.prototype.splice.apply(this._filterMap, [start, 0].concat(items.map(function() {
            return !isFalseMirror;
         })));
         this._addToSortMap(start, items.length);
      },

      /**
       * Удаляет срез элементов из индексов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} [count] Кол-во элементов
       * @private
       */
      _removeItems: function (start, count) {
         start = start || 0;
         count = count === undefined ? this._sortMap.length - start : count;

         this._itemsMap.splice(start, count);
         this._sourceMap.splice(start, count);
         this._filterMap.splice(start, count);
         this._removeFromSortMap(start, count);
      },

      /**
       * Заменяет элементы в индексах
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} items Новые элементы
       * @returns {Array} Замененные элементы
       * @private
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
       * Возвращает элементы в соотвествии с порядком сортировки
       * @param {Array} items Элементы
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @returns {Array}
       * @private
       */
      _getItemsSorted: function (items, start) {
         start = start || 0;

         if (this._sortMap.length === 0) {
            return items;
         }

         var count = items.length,
            sorted = [];
         for (var i = 0; i < count; i++) {
            sorted.push(
               items[this._sortMap[start + i]]
            );
         }
         return sorted;
      },

      /**
       * Обработчик события об изменении исходной коллекции
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array} newItems Новые элементы исходной коллеции.
       * @param {Number} newItemsIndex Индекс исходной коллеции, в котором появились новые элементы.
       * @param {Array} oldItems Удаленные элементы исходной коллеции.
       * @param {Number} oldItemsIndex Индекс исходной коллеции, в котором удалены элементы.
       * @private
       */
      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         var newItemsMap = this._itemsMap.slice(newItemsIndex, newItemsIndex + newItems.length),
            oldItemsMap;
         if (action === IBindCollectionProjection.ACTION_REPLACE ||
            action === IBindCollectionProjection.ACTION_RESET
         ) {
            oldItemsMap = oldItems.map((function(item) {
               return this._convertToItem(item);
            }).bind(this));
         } else {
            oldItemsMap = this._itemsMap.slice(oldItemsIndex, oldItemsIndex + oldItems.length);
         }

         if (this._isFalseMirror() && action !== IBindCollectionProjection.ACTION_RESET) {
            var enumerator = this._getServiceEnumerator(),
               newItemsInternalIndex,
               oldItemsInternalIndex;
            for (var i = 0, len = Math.max(newItemsMap.length, oldItemsMap.length); i < len; i++) {
               newItemsInternalIndex = newItems[i] === undefined ? -1 : enumerator.getInternalBySource(newItemsIndex + i);
               oldItemsInternalIndex = oldItems[i] === undefined ? -1 : enumerator.getInternalBySource(oldItemsIndex + i);
               this._notify(
                  'onCollectionChange',
                  action,
                  newItemsInternalIndex === -1 ? [] : [newItemsMap[i]],
                  newItemsInternalIndex === -1 ? 0 : newItemsInternalIndex,
                  oldItemsInternalIndex === -1 ? [] : [oldItemsMap[i]],
                  oldItemsInternalIndex === -1 ? 0 : oldItemsInternalIndex
               );
            }
         } else {
            this._notify(
               'onCollectionChange',
               action,
               newItemsMap,
               newItemsIndex,
               oldItemsMap,
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
       * @private
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
            if (this._isFalseMirror()) {
               this._reFilter(newItemsIndex, newItems.length);
               this._reSort(true);
            } else {
               notifyStandard.call(this);
            }
            break;

         case IBindCollectionProjection.ACTION_REMOVE:
            notifyStandard.call(this);
            this._removeItems(oldItemsIndex, oldItems.length);
            this._getServiceEnumerator().reIndex();
            break;

         case IBindCollectionProjection.ACTION_REPLACE:
            if (this._isFalseMirror()) {
               this._removeItems(oldItemsIndex, oldItems.length);
               this._reSort(true);

               this._addItems(newItemsIndex, newItems);
               this._reFilter(newItemsIndex, newItems.length);
               this._reSort(true);
            } else {
               this._replaceItems(newItemsIndex, newItems);
               notifyStandard.call(this);
            }
            this._getServiceEnumerator().reIndex();
            break;

         case IBindCollectionProjection.ACTION_MOVE:
            notifyStandard.call(this);
            this._removeItems(oldItemsIndex, oldItems.length);
            this._addItems(newItemsIndex, newItems);
            if (this._isSorted()) {
               this._reSort(true);
            } else {
               notifyStandard.call(this);
            }
            this._getServiceEnumerator().reIndex();
            break;

         case IBindCollectionProjection.ACTION_RESET:
            oldItems = this._getItemsSorted(oldItems);

            this._reBuild();
            this._reSort(false);
            this._getServiceEnumerator().reIndex();

            newItems = this._getItemsSorted(newItems);
            notifyStandard.call(this);
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
      this._reSort(true);
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.Collection', function(config) {
      return new CollectionProjection(config);
   });

   return CollectionProjection;
});
