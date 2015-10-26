/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Collection', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
   'js!SBIS3.CONTROLS.Data.Projection.ICollection',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Collection.CollectionItem'
], function (IEnumerable, IBindCollectionProjection, ICollectionProjection, CollectionProjectionEnumerator, Projection) {
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
         _itemModule: 'SBIS3.CONTROLS.Data.Collection.CollectionItem',

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.CollectionItem[]} Индекс проекции коллекции
          */
         _itemsMap: [],

         /**
          * @var {*[]} Индекс исходной коллекции
          */
         _sourceMap: [],

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator} Энумератор проекции - для отслеживания текущего элемента и поиска по свойствам
          */
         _enumerator: undefined,

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

      $constructor: function () {
         this._publish('onCurrentChange', 'onCollectionChange', 'onCollectionItemChange');

         if (!this._options.collection) {
            throw new Error('Source collection is undefined');
         }
         if (!$ws.helpers.instanceOfMixin(this._options.collection, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new Error('Source collection should implement SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         this._enumerator = this.getEnumerator();

         this._init();

         this._onSourceCollectionChange = onSourceCollectionChange.bind(this);
         this._onSourceCollectionItemChange = onSourceCollectionItemChange.bind(this);
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

         this._enumerator = undefined;

         CollectionProjection.superclass.destroy.call(this);
      },

      /**
       * Возвращает элемент проекции с указанным хэшем
       * @param {String} hash Хеш элемента
       * @returns {SBIS3.CONTROLS.Data.Collection.CollectionItem}
       */
      getByHash: function(hash) {
         return this._enumerator.getItemByPropertyValue('hash', hash);
      },

      /**
       * Возвращает индекс элемента проекции с указанным хэшем
       * @param {String} hash Хеш элемента
       * @returns {Number}
       */
      getIndexByHash: function (hash) {
         return this._enumerator.getItemIndexByPropertyValue('hash', hash);
      },

      /**
       * Возвращает элемент по индексу
       * @param {Number} [index] Индекс
       * @returns {SBIS3.CONTROLS.Data.Collection.CollectionItem}
       * @state mutable
       */
      at: function (index) {
         return this._enumerator.at(index);
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

      concat: function () {
         throw new Error('SBIS3.CONTROLS.Data.Projection.Collection is read only. You should change the source collection.');
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Projection.ICollection

      getCollection: function () {
         return this._options.collection;
      },

      getCurrent: function () {
         return this._enumerator.getCurrent();
      },

      setCurrent: function (item, silent) {
         var oldCurrent = this.getCurrent();
         if (oldCurrent !== item) {
            var oldPosition = this.getCurrentPosition();
            this._enumerator.setCurrent(item);
            if (!silent) {
               this._notifyCurrentChange(
                  this.getCurrent(),
                  oldCurrent,
                  this._enumerator.getPosition(),
                  oldPosition
               );
            }
         }
      },

      getCurrentPosition: function () {
         return this._enumerator.getPosition();
      },

      setCurrentPosition: function (position, silent) {
         var oldPosition = this.getCurrentPosition();
         if (position !== oldPosition) {
            var oldCurrent = this.getCurrent();
            this._enumerator.setPosition(position);
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
             hasNext = this._enumerator.getNext() ? true : false;
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
             hasPrevious = this._enumerator.getPrevious() ? true : false;
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
         return this._enumerator.getPosition() === 0;
      },

      moveToLast: function () {
         var position = this._enumerator.getInternalBySource(this.getCollection().getCount() - 1);
         if (this.getCurrentPosition() === position) {
            return false;
         }
         this.setCurrentPosition(position);
         return this._enumerator.getPosition() === position;
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

         this._sort = Array.prototype.slice.call(arguments).filter(function(item) {
            return typeof item === 'function';
         });

         this._reSort(true);
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region Protected methods

      /**
       * Инициализирует проекцию
       * @private
       */
      _init: function () {
         this._reBuild();
      },

      /**
       * Превращает объект в элемент коллекции
       * @param {*} item Объект
       * @returns {SBIS3.CONTROLS.Data.Collection.CollectionItem}
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

         this._enumerator.reIndex();
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
                  this._enumerator.reIndex();
                  this._notifyCollectionChange(
                     IBindCollectionProjection.ACTION_ADD,
                     [item],
                     index,
                     [],
                     -1
                  );
               } else if (oldMatch !== undefined) {
                  this._notifyCollectionChange(
                     IBindCollectionProjection.ACTION_REMOVE,
                     [],
                     -1,
                     [item],
                     index
                  );
                  this._filterMap[index] = match;
                  this._enumerator.reIndex();
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

         this._enumerator.reIndex();

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
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem[]} items Элементы
       * @private
       */
      _addItems: function (start, items) {
         Array.prototype.splice.apply(this._itemsMap, [start, 0].concat(
            items.map((function(item) {
               return this._convertToItem(item);
            }).bind(this)))
         );
         Array.prototype.splice.apply(this._sourceMap, [start, 0].concat(items));
         Array.prototype.splice.apply(this._filterMap, [start, 0].concat(items.map(function() {
            return false;
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
       * Обработчик события об изменении исходной коллекции
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array} newItems Новые элементы исходной коллеции.
       * @param {Number} newItemsIndex Индекс исходной коллеции, в котором появились новые элементы.
       * @param {Array} oldItems Удаленные элементы исходной коллеции.
       * @param {Number} oldItemsIndex Индекс исходной коллеции, в котором удалены элементы.
       * @private
       */
      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (action === IBindCollectionProjection.ACTION_RESET) {
            this._notify(
               'onCollectionChange',
               action,
               this._itemsMap,
               this._itemsMap.length,
               [],
               0
            );
         } else {
            var newItemsProjectionIndex = this._enumerator.getInternalBySource(newItemsIndex),
               oldItemsProjectionIndex = this._enumerator.getInternalBySource(oldItemsIndex);
            this._notify(
               'onCollectionChange',
               action,
               newItemsProjectionIndex === -1 ? [] : this._itemsMap.slice(newItemsIndex, newItemsIndex + newItems.length),
               newItemsProjectionIndex,
               oldItemsProjectionIndex === -1 ? [] : this._itemsMap.slice(oldItemsIndex, oldItemsIndex + oldItems.length),
               oldItemsProjectionIndex
            );
         }
      },

      /**
       * Генерирует событие об изменении текущего элемента проекции коллекции
       * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem} oldCurrent Старый текущий элемент
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
      switch (action) {
         case IBindCollectionProjection.ACTION_ADD:
            this._addItems(newItemsIndex, newItems);
            this._reFilter(newItemsIndex, newItems.length);
            this._reSort(true);
            break;

         case IBindCollectionProjection.ACTION_REMOVE:
            this._notifyCollectionChange(
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
            this._removeItems(oldItemsIndex, oldItems.length);
            this._enumerator.reIndex();
            break;

         case IBindCollectionProjection.ACTION_REPLACE:
            this._removeItems(oldItemsIndex, oldItems.length);
            this._addItems(newItemsIndex, newItems);
            this._reFilter(newItemsIndex, newItems.length);
            this._reSort(true);
            break;

         case IBindCollectionProjection.ACTION_MOVE:
            this._notifyCollectionChange(
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
            this._removeItems(oldItemsIndex, oldItems.length);
            this._addItems(newItemsIndex, newItems);
            this._reFilter(newItemsIndex, newItems.length);
            this._reSort(true);
            break;

         case IBindCollectionProjection.ACTION_RESET:
            var oldItemsOrdered = this._sortMap.length ?
               this._sortMap.map(function(index) {
                  return oldItems[index];
               }) :
               oldItems;

            this._reBuild();
            this._reSort(false);
            this._notifyCollectionChange(
               action,
               this._sortMap.length ?
                  this._sortMap.map(function(index) {
                     return newItems[index];
                  }) :
                  newItems,
               newItemsIndex,
               oldItemsOrdered,
               oldItemsIndex
            );
            break;
      }
   },

   /**
    * Обрабатывает событие об изменении исходной коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem} item Измененный элемент коллеции.
    * @param {Integer} index Индекс измененного элемента.
    * @param {String} [property] Измененное свойство элемента
    * @private
    */
   onSourceCollectionItemChange = function (event, item, index) {
      this._notify(
         'onCollectionItemChange',
         this._itemsMap[index],
         this._enumerator.getInternalBySource(index),
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
