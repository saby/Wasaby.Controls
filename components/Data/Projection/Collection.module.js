/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Collection', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.IList',
   'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection.Projection',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Projection.CollectionItem'
], function (
   IEnumerable,
   IList,
   IBindCollectionProjection,
   CollectionProjectionEnumerator,
   Projection,
   Di,
   Utils
) {
   'use strict';

   /**
    * Проекция коллекции - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @class SBIS3.CONTROLS.Data.Projection.Collection
    * @extends SBIS3.CONTROLS.Data.Projection.Projection
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Collection.IList
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollectionProjection
    * @ignoreMethods notifyItemChange
    * @public
    * @author Мальцев Алексей
    */

   var CollectionProjection = Projection.extend([IEnumerable, IList, IBindCollectionProjection], /** @lends SBIS3.CONTROLS.Data.Projection.Collection.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Collection',
      
      /**
       * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Исходная коллекция
       * @name SBIS3.CONTROLS.Data.Projection.Collection#collection
       */
      _$collection: null,

      /**
       * @cfg {Array.<String>} Названия свойств элемента коллекции, от которых зависят фильтрация и/или сортировка.
       * @name SBIS3.CONTROLS.Data.Projection.Collection#importantItemProperties
       * @remark
       * Изменение любого из указанных свойств элемента коллекции приведет к перерасчету фильтации и сортировки.
       */
      _$importantItemProperties: null,

      /**
       * @member {String} Модуль элемента проекции
       */
      _itemModule: 'projection.collection-item',

      /**
       * @member {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} Элементы проекции
       */
      _items: [],

      /**
       * @member {Function(*, Number} Фильтр элементов проекции
       */
      _filter: undefined,

      /**
       * @member {Array.<Boolean>} Результат применения фильтра: индекс в коллекции -> прошел фильтр
       */
      _filterMap: [],

      /**
       * @member {Function} Метод группировки элементов проекции
       */
      _group: null,

      /**
       * @member {Array.<Function>} Пользовательские методы сортировки элементов
       */
      _userSort: [],

      /**
       * @member {Array.<Number>} Результат применения сортировки: индекс в проекции -> индекс в коллекции
       */
      _sortMap: [],

      /**
       * @member {Boolean|undefined} Признак, что порядок элементов отличается от исходной коллекции
       */
      _isSortedCache: undefined,

      /**
       * @member {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator} Служебный энумератор проекции - для отслеживания текущего элемента и поиска по свойствам
       */
      _serviceEnumerator: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator} Служебный энумератор проекции - для поиска следующего или предыдущего элемента
       */
      _navigationEnumerator: null,

         /**
          * @member {Boolean} Генерация событий включена
          */
         _eventRaising: true,

      /**
       * @member {Function} Обработчик события об изменении исходной коллекции
       */
      _onSourceCollectionChange: null,

      /**
       * @member {Function} Обработчик события об изменении элемента исходной коллекции
       */
      _onSourceCollectionItemChange: null,

      constructor: function $CollectionProjection(options) {
         this._$importantItemProperties = [];
         this._items = [];
         this._filterMap = [];
         this._userSort = [];
         this._sortMap = [];

         if (options) {
            if ('itemModule' in options) {
               this._itemModule = options.itemModule;
            }
            if ('convertToItem' in options) {
               this._convertToItem = options.convertToItem;
            }
         }

         CollectionProjection.superclass.constructor.call(this, options);

         if (!this._$collection) {
            throw new Error(this._moduleName + ': source collection is undefined');
         }
         if (!$ws.helpers.instanceOfMixin(this._$collection, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new TypeError(this._moduleName + ': source collection should implement SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         this._publish('onCurrentChange', 'onCollectionChange', 'onCollectionItemChange');
         this._init();
         this._bindHandlers();
         if ($ws.helpers.instanceOfMixin(this._$collection, 'SBIS3.CONTROLS.Data.Bind.ICollection')) {
            this._$collection.subscribe('onCollectionChange', this._onSourceCollectionChange);
            this._$collection.subscribe('onCollectionItemChange', this._onSourceCollectionItemChange);
         }
      },

      destroy: function () {
         if ($ws.helpers.instanceOfMixin(this._$collection, 'SBIS3.CONTROLS.Data.Bind.ICollection')) {
            this._$collection.unsubscribe('onCollectionChange', this._onSourceCollectionChange);
            this._$collection.unsubscribe('onCollectionItemChange', this._onSourceCollectionItemChange);
         }

         this._serviceEnumerator = null;

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

      //endregion mutable

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов проекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator}
       */
      getEnumerator: function () {
         return this._getEnumerator();
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

      //region SBIS3.CONTROLS.Data.Collection.IList

      assign: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      append: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      prepend: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      clear: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      add: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      at: function (index) {
         return this._getServiceEnumerator().at(index);
      },

      remove: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      removeAt: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      replace: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      getIndex: function (item) {
         if (!$ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Projection.CollectionItem')) {
            return -1;
         }
         return this.getIndexByHash(item.getHash());
      },

      getCount: function () {
         return $ws.helpers.reduce(this._sortMap, function(prev, current) {
            return prev + (this._filterMap[current] ? 1 : 0);
         }, 0, this);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region Public methods

      /**
       * Возвращает исходную коллекцию, для которой построена проекция
       * @returns {SBIS3.CONTROLS.Data.Collection.IEnumerable}
       */
      getCollection: function () {
         return this._$collection;
      },

      /**
       * Возвращает элементы проекции
       * @returns {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>}
       */
      getItems: function () {
         return this._items.slice();
      },

      /**
       * Возвращает текущий элемент
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       */
      getCurrent: function () {
         return this._getServiceEnumerator().getCurrent();
      },

      /**
       * Устанавливает текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Новый текущий элемент
       * @param {Boolean} [silent=false] Не генерировать событие onCurrentChange
       */
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

      /**
       * Возвращает позицию текущего элемента
       * @returns {Number}
       */
      getCurrentPosition: function () {
         return this._getServiceEnumerator().getPosition();
      },

      /**
       * Устанавливает позицию текущего элемента
       * @param {Number} position Позиция текущего элемента. Значение -1 указывает, что текущий элемент не выбран.
       * @param {Boolean} [silent=false] Не генерировать событие onCurrentChange
       */
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

      /**
       * Возвращает следующий элемент относительно item
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item элемент проекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       */
      getNext: function (item) {
         return this._getNearbyItem(item, true);
      },

      /**
       * Возвращает предыдущий элемент относительно item
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} index элемент проекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       */
      getPrevious: function (item) {
         return this._getNearbyItem(item, false);
      },

      /**
       * Устанавливает текущим следующий элемент
       * @returns {Boolean} Есть ли следующий элемент
       */
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

      /**
       * Устанавливает текущим предыдущий элемент
       * @returns {Boolean} Есть ли предыдущий элемент
       */
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

      /**
       * Устанавливает текущим первый элемент
       * @returns {Boolean} Есть ли первый элемент
       */
      moveToFirst: function () {
         if (this.getCurrentPosition() === 0) {
            return false;
         }
         this.setCurrentPosition(0);
         return this._getServiceEnumerator().getPosition() === 0;
      },

      /**
       * Устанавливает текущим последний элемент
       * @returns {Boolean} Есть ли последний элемент
       */
      moveToLast: function () {
         var position = this.getCount() - 1;
         if (this.getCurrentPosition() === position) {
            return false;
         }
         this.setCurrentPosition(position);
         return this.getCurrentPosition() === position;
      },

      /**
       * Возвращает фильтр элементов проекции
       * @returns {Function}
       */
      getFilter: function () {
         return this._filter;
      },

      /**
       * Устанавливает фильтр элементов проекции. Для сброса ранее установленного фильтра вызвать этот метод без параметров.
       * @param {Function} [filter] Фильтр элементов: аргументами приходят элемент и его позиция, должен вернуть Boolean
       */
      setFilter: function (filter) {
         if (this._filter === filter) {
            return;
         }
         
         var session = this._startUpdateSession();
         this._filter = filter;
         this._reFilter();
         this._finishUpdateSession(session);
      },

      /**
       * Возвращает способ группировки элементов проекции
       * @returns {Function}
       */
      getGroup: function () {
         return this._group;
      },

      /**
       * Устанавливает способ группировки элементов проекции. Для сброса ранее установленного способа группировки вызвать этот метод без параметров.
       * @param {Function} [group] Способ группировки элементов: аргументами приходят элемент и его позиция, должен вернуть Object - группу, в которую входит элемент
       */
      setGroup: function (group) {
         this._group = group;
         //TODO: implement it
         throw new Error(this._moduleName + '::setGroup(): is under construction');
      },

      /**
       * Возвращает способ сортировки элементов проекции
       * @returns {Function|Array.<Function>}
       */
      getSort: function () {
         return this._userSort.length > 1 ? this._userSort : this._userSort[0];
      },

      /**
       * Устанавливает способ сортировки элементов проекции. Для сброса ранее установленного способа сортировки вызвать этот метод без параметров.
       * Можно передать набор аргументов - тогда будет произведена множественная сортировка.
       * @param {Function} [sort] Способ сортировки элементов: аргументами приходят 2 объекта (a, b) вида {item: item, index: index}, должен вернуть -1|0|1 (см. Array.prototype.sort())
       * @example
       * <pre>
       *     var projection = new CollectionProjection({...});
       *
       *     //получаем коллекию, отсортированную по возрастанию id
       *     projection.setSort(function(a, b) {
       *       return a.item.id - b.item.id
       *     });
       *
       *     //получаем коллекию, отсортированную сначала по title, а потом - по id
       *     projection.setSort(function(a, b) {
       *       return a.item.title > b.item.title
       *     }, function(a, b) {
       *       return a.item.id - b.item.id
       *     });
       * </pre>
       */
      setSort: function () {
         if (this._userSort.length === arguments.length) {
            var changed = false;
            for (var i = 0; i < arguments.length; i++) {
               if (this._userSort[i] !== arguments[i]) {
                  changed = true;
               }
            }

            if (!changed) {
               return;
            }
         }

         this._userSort = $ws.helpers.filter(Array.prototype.slice.call(arguments), function(item) {
            return typeof item === 'function';
         });

         var session = this._startUpdateSession();
         this._reSort();
         this._finishUpdateSession(session);
      },

      /**
       * Возвращает индекс элемента в проекции по индексу в исходной коллекции
       * @param {Number} index Индекс элемента в исходной коллекции
       * @returns {Number}
       * @deprecated метод будет удален в 3.7.4 используйте getIndexBySourceIndex()
       */
      getInternalBySource: function (index) {
         Utils.logger.stack(this._moduleName + '::getInternalBySource(): method is deprecated and will be removed in 3.7.4. Use getIndexBySourceIndex() instead.');
         return this.getIndexBySourceIndex(index);
      },

      /**
       * Возвращает индекс элемента в исходной коллекции по индексу в проекции
       * @param {Number} index Индекс элемента в проекции
       * @returns {Number}
       * @deprecated метод будет удален в 3.7.4 используйте getSourceIndexByIndex()
       */
      getSourceByInternal: function (index) {
         Utils.logger.stack(this._moduleName + '::getSourceByInternal(): method is deprecated and will be removed in 3.7.4. Use getSourceIndexByIndex() instead.');
         return this.getSourceIndexByIndex(index);
      },

      /**
       * Возвращает индекс элемента в исходной коллекции по его индексу в проекции
       * @param {Number} index Индекс элемента в проекции
       * @returns {Number} Индекс элемента в исходной коллекции
       */
      getSourceIndexByIndex: function (index) {
         var sourceIndex = this._getServiceEnumerator().getSourceByInternal(index);
         return sourceIndex === undefined || sourceIndex === null ? -1 : sourceIndex;
      },

      /**
       * Возвращает индекс элемента проекции в исходной коллекции
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Элемент проекции
       * @returns {Number} Индекс элемента проекции в исходной коллекции
       */
      getSourceIndexByItem: function (item) {
         var index = this.getIndex(item);
         return index == -1 ? -1 : this.getSourceIndexByIndex(index);
      },

      /**
       * Возвращает индекс элемента в проекции по индексу в исходной коллекции
       * @param {Number} index Индекс элемента в исходной коллекции
       * @returns {Number} Индекс элемента в проекции
       */
      getIndexBySourceIndex: function (index) {
         var selfIndex = this._getServiceEnumerator().getInternalBySource(index);
         return selfIndex === undefined || selfIndex === null ? -1 : selfIndex;
      },

      /**
       * Возвращает позицию элемента исходной коллекции в проекции.
       * @param {*} item Элемент исходной коллеции
       * @returns {Number} Позвиция элемента в проекции или -1, если не входит в проекцию
       */
      getIndexBySourceItem: function (item) {
         var sourceIndex = this.getCollection().getIndex(item);
         return sourceIndex === -1 ? -1 : this.getIndexBySourceIndex(sourceIndex);
      },

      /**
       * Возвращает элемент проекции по индексу исходной коллекции.
       * @param {Number} index Индекс элемента в исходной коллекции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem} Элемент проекции или undefined, если index не входит в проекцию
       */
      getItemBySourceIndex: function (index) {
         index = this.getIndexBySourceIndex(index);
         return index == -1 ? undefined : this.at(index);
      },

      /**
       * Возвращает элемент проекции для элемента исходной коллекции.
       * @param {*} item Элемент исходной коллеции
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem} Элемент проекции или undefined, если item не входит в проекцию
       */
      getItemBySourceItem: function (item) {
         var index = this.getIndexBySourceItem(item);
         return index == -1 ? undefined : this.at(index);
      },

      /**
       * Включает/выключает генерацию событий об изменении проекции
       * @param {Boolean} enabled Генерация событий влючена/выключена
       */
      setEventRaising: function(enabled) {
         this._eventRaising = !!enabled;
      },

      /**
       * Возвращает признак, включена ли генерация событий об изменении проекции
       * @returns {Boolean}
       */
      isEventRaising: function() {
         return this._eventRaising;
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollection

      //region Public methods

      /**
       * Уведомляет подписчиков об изменении элемента коллекции
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Элемент проекции
       * @param {String} property Изменившееся свойство
       */
      notifyItemChange: function (item, property) {
         var session;
         if (this._filter) {
            session = this._startUpdateSession();
            this._reFilter();
            this._finishUpdateSession(session);
         }
         if (!this._eventRaising) {
            return;
         }
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
         this._onSourceCollectionChange = _private.onSourceCollectionChange.bind(this);
         this._onSourceCollectionItemChange = _private.onSourceCollectionItemChange.bind(this);
      },

      _unbindHandlers: function() {
      },

      /**
       * Возвращает энумератор
       * @param {Boolean} [clone=false] Клонировать
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator}
       * @protected
       */
      _getEnumerator: function (clone) {
         return new CollectionProjectionEnumerator({
            items: clone ? this._items.slice() : this._items,
            filterMap: clone ? this._filterMap.slice() : this._filterMap,
            sortMap: clone ? this._sortMap.slice() : this._sortMap
         });
      },

      /**
       * Возвращает служебный энумератор
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator}
       * @protected
       */
      _getServiceEnumerator: function () {
         return this._serviceEnumerator || (this._serviceEnumerator = this._getEnumerator());
      },

      _getNavigationEnumerator: function() {
         return this._navigationEnumerator || (this._navigationEnumerator = this._getEnumerator());
      },

      /**
       * Превращает объект в элемент проекции
       * @param {*} item Объект
       * @param {Number} index Индекс объекта
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @protected
       */
      _convertToItem: function (item) {
         return Di.resolve(this._itemModule, {
            owner: this,
            contents: item
         });
      },

      /**
       * Перерасчитывает все показатели (сортировка при этом сбрасывается)
       * @protected
       */
      _reBuild: function () {
         this._items.length = 0;
         this._filterMap.length = 0;
         this._reIndex();

         var enumerator = this._$collection.getEnumerator(),
            index = 0,
            item;
         while ((item = enumerator.getNext())) {
            this._items.push(this._convertToItem(item, index));
            this._filterMap.push(true);
            index++;
         }

         this._reSort();
      },

      /**
       * Производит фильтрацию для среза элементов
       * @param {Number} [start=0] Начальный индекс
       * @param {Number} [count] Кол-во элементов (по умолчанию - все элементы)
       * @protected
       */
      _reFilter: function (start, count) {
         start = start || 0;
         count = count || this._items.length - start;

         var finish = start + count,
             item,
             match,
             oldMatch;
         for (var index = start; index < finish; index++) {
            item = this._items[index];
            match = !this._filter || this._filter(item.getContents(), index, item);
            oldMatch = this._filterMap[index];

            if (match !== oldMatch) {
               if (match) {
                  this._filterMap[index] = match;
                  this._reIndex();
               } else if (oldMatch !== undefined) {
                  this._filterMap[index] = match;
                  this._reIndex();
               }
            }
         }
      },

      /**
       * Вызывает фильтрацию и сортировку, производит анализ изменений
       * @param {Number} [start=0] Начальный индекс
       * @param {Number} [count] Кол-во элементов (по умолчанию - все элементы)
       * @protected
       */
      _reAnalize: function (start, count) {
         start = start || 0;
         count = count || this._items.length - start;

         var session = this._startUpdateSession();
         this._reSort();
         this._reFilter(start, count);
         this._finishUpdateSession(session);
      },

      /**
       * Производит сортировку элементов
       * @protected
       */
      _reSort: function () {
         this._sortMap.length = 0;
         Array.prototype.push.apply(this._sortMap, this._buildSortMap());

         this._reIndex();
      },

      /**
       * Производит построение sortMap
       * @return {Array.<Number>}
       * @protected
       */
      _buildSortMap: function () {
         if (this._userSort.length) {
            return _private.sorters.user(this._items, this._userSort);
         } else {
            return _private.sorters.natural(this._items);
         }
      },

      /**
       * Запускает серию обновлений
       * @return {Object}
       * @protected
       */
      _startUpdateSession: function () {
         //Индексируем состояние элементов до изменений
         var enumerator = this._getServiceEnumerator(),
            savedPosition = enumerator.getPosition(),
            items = [],
            contents = [],
            item;
         enumerator.reset();
         while ((item = enumerator.getNext())) {
            items.push(item);
            contents.push(item.getContents());
         }
         enumerator.setPosition(savedPosition);
         return {
            before: items,
            beforeContents: contents
         };
      },

      /**
       * Завершает серию обновлений, генерирует события об изменениях
       * @param {Object} session Серия обновлений
       * @protected
       */
      _finishUpdateSession: function (session) {
         //TODO: порефактроить тут всё, оптимизировать Array.indexOf
         var enumerator = this._getServiceEnumerator(),
            savedPosition = enumerator.getPosition(),
            afterItem;

         //Индексируем состояние элементов после изменений
         this._reIndex();
         enumerator.reset();
         session.after = [];
         while ((afterItem = enumerator.getNext())) {
            session.after.push(afterItem);
         }
         enumerator.setPosition(savedPosition);

         var groups = ['added', 'removed', 'replaced', 'moved'],
            changes,
            maxRepeats = 65535,
            startFrom,
            offset;

         //Информируем об изменениях по группам
         for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            //Собираем изменения в пачки (следующие подряд наборы)
            startFrom = 0;
            offset = 0;
            while(startFrom !== -1) {
               changes = this._getGroupChanges(
                  groups[groupIndex],
                  session.before,
                  session.after,
                  session.beforeContents,
                  startFrom,
                  offset
               );
               this._applyGroupChanges(
                  groups[groupIndex],
                  changes,
                  session.before,
                  session.after,
                  session.beforeContents
               );
               if (changes.endAt !== -1 && changes.endAt <= startFrom) {
                  maxRepeats--;
                  if (maxRepeats === 0) {
                     throw new Error('Endless cycle detected.');
                  }
               }
               startFrom = changes.endAt;
               offset = changes.offset;
            }
         }
      },

      /**
       * Возвращает изменения группы
       * @param {String} groupName Название группы
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} before Элементы до изменений
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} after Элементы после изменений
       * @param {Array.<*>} beforeContents Содержимое элементов до изменений
       * @param {Number} [startFrom=0] Начать с элемента номер
       * @param {Number} [offset=0] Смещение элеметов в after относительно before
       * @return {Object}
       * @protected
       */
      _getGroupChanges: function (groupName, before, after, beforeContents, startFrom, offset) {
         var newItems = [],
            newItemsIndex = 0,
            oldItems = [],
            oldItemsIndex = 0,
            beforeItem,//элемент до изменений
            beforeIndex,//индекс элемента до изменений
            afterItem,//элемент после изменений
            afterIndex,//индекс элемента после изменений
            exit = false,
            index,
            count = Math.max(before.length, after.length);
         
         startFrom = startFrom || 0;
         offset = offset || 0;
         for (index = startFrom; index < count; index++) {
            beforeItem = before[index];
            afterItem = after[index];
            switch(groupName) {
               case 'added':
                  //собираем добавленные элементы
                  if (!afterItem) {
                     continue;
                  }
                  afterIndex = index;
                  beforeIndex = Array.indexOf(before, afterItem);
                  //если элемента не было - добавим его в список новых,
                  //если был - отдаем накопленный список новых, если там что-то есть
                  if (beforeIndex === -1) {
                     //элемент добавлен
                     newItems.push(afterItem);
                     newItemsIndex = newItems.length === 1 ? afterIndex : newItemsIndex;
                  } else if (newItems.length) {
                     exit = true;
                  }
                  break;
               
               case 'removed':
                  //собираем удаленные элементы
                  if (!beforeItem) {
                     continue;
                  }
                  beforeIndex = index;
                  afterIndex = Array.indexOf(after, beforeItem);
                  //если элемента не стало - добавим его в список старых,
                  //если остался - отдаем накопленный список старых, если там что-то есть
                  if (afterIndex === -1) {
                     oldItems.push(beforeItem);
                     oldItemsIndex = oldItems.length === 1 ? beforeIndex : oldItemsIndex;
                  } else if (oldItems.length) {
                     exit = true;
                  }
                  break;
               
               case 'replaced':
                  //собираем замененные элементы
                  if (!afterItem) {
                     continue;
                  }
                  afterIndex = index;
                  beforeIndex = Array.indexOf(before, afterItem);
                  //если элемент на месте, но изменилось его содержимое - добавим новый в список новых, а для старого генерим новую обертку, которую добавим в список старых
                  //если остался - отдаем накопленные списки старых и новых, если в них что-то есть
                  if (
                     beforeIndex === afterIndex &&
                     beforeContents[index] !== afterItem.getContents()
                  ) {
                     oldItems.push(this._convertToItem(beforeContents[index], index));
                     newItems.push(afterItem);
                     oldItemsIndex = newItemsIndex = oldItems.length === 1 ? beforeIndex : oldItemsIndex;
                  } else if (oldItems.length) {
                     exit = true;
                  }
                  break;
               
               case 'moved':
                  //собираем перемещенные элементы
                  if (!beforeItem) {
                     continue;
                  }
                  //поверяем, что afterItem есть в before
                  do {
                     afterItem = after[index + offset];
                     beforeIndex = Array.indexOf(before, afterItem);
                     if (beforeIndex === -1) {
                        //afterItem нет в before - пропускаем его
                        offset++;
                     } else {
                        break;
                     }
                  } while(afterItem);
                  
                  beforeIndex = index;
                  afterIndex = Array.indexOf(after, beforeItem);
                  //если элемент присутствует, но изменилась его позиция - добавляем его в список старых и новых
                  //в противом случае - отдаем накопленные списки старых и новых, если в них что-то есть
                  if (
                     beforeIndex !== -1 &&
                     afterIndex !== -1 &&
                     beforeIndex !== afterIndex - offset
                  ) {
                     if (
                        oldItems.length && beforeIndex !== oldItemsIndex + oldItems.length ||
                        newItems.length && afterIndex !== newItemsIndex + newItems.length
                     ) {
                        exit = true;
                     } else {
                        oldItems.push(beforeItem);
                        oldItemsIndex = oldItems.length === 1 ? beforeIndex : oldItemsIndex;
                        newItems.push(beforeItem);
                        newItemsIndex = newItems.length === 1 ? afterIndex : newItemsIndex;
                     }
                  }
                  break;
            }
            if (exit) {
               break;
            }
         }

         return {
            newItems: newItems,
            newItemsIndex: newItemsIndex,
            oldItems: oldItems,
            oldItemsIndex: oldItemsIndex,
            endAt: exit ? index : -1,
            offset: offset
         };
      },

      /**
       * Применяет изменения группы
       * @param {String} groupName Название группы
       * @param {Object} changes Изменения группы
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} before Элементы до изменений
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} after Элементы после изменений
       * @param {Array.<*>} beforeContents Содержиоме элементов до изменений
       * @protected
       */
      _applyGroupChanges: function (groupName, changes, before, after, beforeContents) {
         var action;//действие, соответствующее группе

         if (changes.newItems.length || changes.oldItems.length) {
            switch(groupName) {
               case 'added':
                  action = IBindCollectionProjection.ACTION_ADD;
                  break;
               case 'removed':
                  action = IBindCollectionProjection.ACTION_REMOVE;
                  break;
               case 'replaced':
                  action = IBindCollectionProjection.ACTION_REPLACE;
                  break;
               case 'moved':
                  action = IBindCollectionProjection.ACTION_MOVE;
                  break;
            }
            //Генерируем событие
            this._notifyCollectionChange(
               action,
               changes.newItems,
               changes.newItemsIndex,
               changes.oldItems,
               changes.oldItemsIndex
            );

            //Производим с before действия согласно событию (синхронизируем изменения)
            switch (groupName) {
               case 'added':
                  Array.prototype.splice.apply(before, [changes.newItemsIndex, 0].concat(changes.newItems));
                  Array.prototype.splice.apply(beforeContents, [changes.newItemsIndex, 0].concat($ws.helpers.map(changes.newItems, function(item) {
                     return item.getContents();
                  })));
                  break;
               case 'removed':
                  before.splice(changes.oldItemsIndex, changes.oldItems.length);
                  beforeContents.splice(changes.oldItemsIndex, changes.oldItems.length);
                  if (changes.endAt !== -1) {
                     changes.endAt -= changes.oldItems.length;
                  }
                  break;
               case 'replaced':
                  Array.prototype.splice.apply(before, [changes.oldItemsIndex, changes.oldItems.length].concat(changes.newItems));
                  Array.prototype.splice.apply(beforeContents, [changes.oldItemsIndex, changes.oldItems.length].concat($ws.helpers.map(changes.newItems, function(item) {
                     return item.getContents();
                  })));
                  break;
               case 'moved':
                  var afterSpliceIndex = changes.oldItemsIndex + changes.oldItems.length > changes.newItemsIndex ?
                     changes.newItemsIndex :
                     changes.newItemsIndex - changes.oldItems.length + 1;
                  before.splice(changes.oldItemsIndex, changes.oldItems.length);
                  Array.prototype.splice.apply(before, [afterSpliceIndex, 0].concat(changes.newItems));
                  beforeContents.splice(changes.oldItemsIndex, changes.oldItems.length);
                  Array.prototype.splice.apply(beforeContents, [afterSpliceIndex, 0].concat($ws.helpers.map(changes.newItems, function(item) {
                     return item.getContents();
                  })));
                  if (changes.endAt !== -1 && changes.oldItemsIndex < changes.newItemsIndex) {
                     changes.endAt -= changes.oldItems.length;
                  }
                  break;
            }
         }
      },

      /**
       * Проверяет, что исходная коллекция искажается проекцией
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
       * Проверяет, что порядок элементов проекции отличается от исходной коллекции
       * @returns {Boolean}
       * @protected
       */
      _isSorted: function () {
         if (this._isSortedCache === undefined) {
            if (this._sortMap.length === this._items.length) {
               this._isSortedCache = false;
               for (var i = 0; i < this._sortMap.length; i++) {
                  if (i !== this._sortMap[i]) {
                     this._isSortedCache = true;
                     break;
                  }
               }
            } else {
               this._isSortedCache = true;
            }
         }
         return this._isSortedCache;
      },

      /**
       * Проверяет, что используется пользовательская сортировка
       * @returns {Boolean}
       * @protected
       */
      _isUserSorted: function () {
         return this._userSort.length > 0;
      },

      /**
       * Дробавляет срез элементов в индексы
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} items Элементы
       * @protected
       */
      _addItems: function (start, sourceItems) {
         var isFiltered = this._isFiltered(),
            splice = Array.prototype.splice,
            filterMap = [],
            sortMap = [],
            items = $ws.helpers.map(sourceItems, function(item, index) {
               filterMap.push(!isFiltered);
               sortMap.push(start + index);
               return this._convertToItem(item, start + index);
            }, this);

         splice.apply(this._items, [start, 0].concat(items));
         splice.apply(this._filterMap, [start, 0].concat(filterMap));
         splice.apply(this._sortMap, [start, 0].concat(sortMap));
      },

      /**
       * Удаляет срез элементов из индексов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} [count] Кол-во элементов
       * @protected
       */
      _removeItems: function (start, count) {
         start = start || 0;
         count = count === undefined ? this._items.length - start : count;

         this._items.splice(start, count);
         this._filterMap.splice(start, count);
         this._removeFromSortMap(start, count);
      },

      /**
       * Удаляет из индекса сортировки срез элементов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} count Кол-во элементов
       * @protected
       */
      _removeFromSortMap: function (start, count) {
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

         this._reIndex();
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
            item = this._items[start + i];
            if (item) {
               replaced.push(item.getContents());
               item.setContents(items[i], true);
            } else {
               Utils.logger.log('SBIS3.CONTROLS.Data.Projection.Collection::_replaceItems(): item for replace is not exists');
            }
         }
         return replaced;
      },

      /**
       * Возвращает срез элементов коллекции в соответствии с примененным фильтром
       * @param {Array} items Элементы исходной коллеции
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Boolean} [newContainers=false] Создать новые контейнеры (потому что в старых уже другие элементы)
       * @returns {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>}
       * @protected
       */
      _getItemsProjection: function (items, start, newContainers) {
         if (!this._isFalseMirror()) {
            if (newContainers) {
               return $ws.helpers.map(items, (function(item, index) {
                  return this._convertToItem(item, start + index);
               }), this);
            } else {
               return this._items.slice(start, start + items.length);
            }
         }

         var result = [],
            index;
         for (var i = 0, count = items.length; i < count; i++) {
            index = i + start;
            if (!this._isFiltered() || this._filterMap[index]) {
               if (newContainers) {
                  result.push(this._convertToItem(items[i], index));
               } else {
                  result.push(this._items[index]);
               }
            }
         }

         return result;
      },

      /**
       * Обработчик события об изменении исходной коллекции
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} newItems Новые элементы исходной коллеции.
       * @param {Number} newItemsIndex Индекс исходной коллеции, в котором появились новые элементы.
       * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} oldItems Удаленные элементы исходной коллеции.
       * @param {Number} oldItemsIndex Индекс исходной коллеции, в котором удалены элементы.
       * @protected
       */
      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (!this._eventRaising) {
            return;
         }
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
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} newCurrent Новый текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       * @protected
       */
      _notifyCurrentChange: function (newCurrent, oldCurrent, newPosition, oldPosition) {
         if (!this._eventRaising) {
            return;
         }
         this._notify(
            'onCurrentChange',
            newCurrent,
            oldCurrent,
            newPosition,
            oldPosition
         );
      },

      /**
       * Вызывает переиндексацию служебных энумераторов
       * @protected
       */
      _reIndex: function () {
         this._getServiceEnumerator().reIndex();
         this._getNavigationEnumerator().reIndex();
         this._isSortedCache = undefined;
      },

      /**
       * Добавляет свойство в importantItemProperties, если его еще там нет
       * @param {String} name Название свойства
       * @protected
       */
      _setImportantProperty: function(name) {
         var index = Array.indexOf(this._$importantItemProperties, name);
         if (index === -1) {
            this._$importantItemProperties.push(name);
         }
      },

      /**
       * Удаляет свойство из importantItemProperties, если оно там есть
       * @param {String} name Название свойства
       * @protected
       */
      _unsetImportantProperty: function(name) {
         var index = Array.indexOf(this._$importantItemProperties, name);
         if (index !== -1) {
            this._$importantItemProperties.splice(index, 1);
         }
      },

      /**
       * Возвращает соседний элемент проекции
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Элемент проекции относительно которого искать
       * @param {Boolean} isNext Следующий или предыдущий элемент
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @protected
       */
      _getNearbyItem: function (item, isNext) {
         var enumerator = this._getNavigationEnumerator();
         enumerator.setCurrent(item);
         var nearbyItem = this._getNavigationEnumerator()[isNext ? 'getNext' : 'getPrevious'](item);
         //FIXME: не должны тут ничего знать про isDeleted
         if(nearbyItem &&
            $ws.helpers.instanceOfModule(nearbyItem.getContents(), 'SBIS3.CONTROLS.Data.Model') &&
            nearbyItem.getContents().isDeleted()
         ){
            return this._getNearbyItem(nearbyItem, isNext);
         }
         return nearbyItem;
      }

      //endregion Protected methods

   });

   var _private = {
      MESSAGE_READ_ONLY: 'The projection is read only. You should modify the source collection instead.',

      sorters: {
         /**
          * Создает индекс сортировки в том же порядке, что и исходная коллекция
          * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} items Элементы проекции.
          * @return {Array.<Number>}
          * @private
          */
         natural: function(items) {
            var map = [];
            for (var index = 0, count = items.length; index < count; index++) {
               map.push(index);
            }
            return map;
         },

         /**
          * Создает индекс сортировки в порядке, определенном набором пользовательских обработчиков
          * @param {Array.<SBIS3.CONTROLS.Data.Projection.CollectionItem>} items Элементы проекции.
          * @param {Array.<Function>} handlers Пользовательские обработчики для Array.prototype.sort
          * @return {Array.<Number>}
          * @private
          */
         user: function(items, handlers) {
            var map = [],
               sorted = [];

            //Создаем служебный массив
            for (var index = 0, count = items.length; index < count; index++) {
               sorted.push({
                  item: items[index],
                  collectionItem: items[index].getContents(),
                  index: index,
                  collectionIndex: index
               });
            }

            //Выполняем сортировку служебного массива
            for (var i = handlers.length - 1; i >= 0; i--) {
               sorted.sort(handlers[i]);
            }

            //Заполняем индекс сортировки по служебному массиву
            for (index = 0, count = sorted.length; index < count; index++) {
               map.push(sorted[index].collectionIndex);
            }

            return map;
         }
      },

      /**
       * Обрабатывает событие об изменении исходной коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array.<*>} newItems Новые элементы коллеции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {Array.<*>} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      onSourceCollectionChange: function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (action === IBindCollectionProjection.ACTION_RESET) {
            oldItems = this._getItemsProjection(oldItems, oldItemsIndex, true);
            this._reBuild();
            if (this._isFiltered()) {
               this._reFilter();
            }
            newItems = this._getItemsProjection(newItems, newItemsIndex);
            this._reIndex();
            this._notifyCollectionChange(
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
            return;
         }

         var session = this._startUpdateSession();

         switch (action) {
            case IBindCollectionProjection.ACTION_ADD:
               this._addItems(newItemsIndex, newItems);
               this._reSort();
               if (this._isFiltered()) {
                  this._reFilter(newItemsIndex, newItems.length);
               }
               break;

            case IBindCollectionProjection.ACTION_REMOVE:
               this._removeItems(oldItemsIndex, oldItems.length);
               this._reSort();
               break;

            case IBindCollectionProjection.ACTION_REPLACE:
               this._replaceItems(newItemsIndex, newItems);
               this._reSort();
               if (this._isFiltered()) {
                  this._reFilter(newItemsIndex, newItems.length);
               }
               break;

            case IBindCollectionProjection.ACTION_MOVE:
               this._removeItems(oldItemsIndex, oldItems.length);
               this._addItems(newItemsIndex, newItems);
               break;
         }

         this._finishUpdateSession(session);
      },

      /**
       * Обрабатывает событие об изменении элемента исходной коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {*} item Измененный элемент коллеции.
       * @param {Integer} index Индекс измененного элемента.
       * @param {Object.<String, *>} [properties] Изменившиеся свойства
       * @private
       */
      onSourceCollectionItemChange: function (event, item, index, properties) {
         if (!this._eventRaising) {
            return;
         }
         this._notify(
            'onCollectionItemChange',
            this._items[index],
            this._getServiceEnumerator().getInternalBySource(index),
            'contents'
         );

         //Only changes of important properties can launch analysis
         for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
               if (Array.indexOf(this._$importantItemProperties, key) > -1) {
                  this._reAnalize(index, 1);
                  break;
               }
            }
         }
      }
   };

   Di.register('projection.collection', CollectionProjection);

   return CollectionProjection;
});
