/* global define, require */
define('js!WS.Data/Display/Collection', [
   'js!WS.Data/Collection/IEnumerable',
   'js!WS.Data/Collection/IList',
   'js!WS.Data/Collection/EventRaisingMixin',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Display/IBindCollection',
   'js!WS.Data/Display/CollectionEnumerator',
   'js!WS.Data/Display/Display',
   'js!WS.Data/Display/CollectionItem',
   'js!WS.Data/Display/ItemsStrategy/Direct',
   'js!WS.Data/Functor/Compute',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-instance',
   'Core/helpers/collection-helpers'
], function (
   IEnumerable,
   IList,
   EventRaisingMixin,
   SerializableMixin,
   IBindCollectionDisplay,
   CollectionEnumerator,
   Display,
   CollectionItem,
   DirectItemsStrategy,
   ComputeFunctor,
   Di,
   Utils,
   CoreInstance,
   CollectionHelpers
) {
   'use strict';

   /**
    * Проекция коллекции - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @class WS.Data/Display/Collection
    * @extends WS.Data/Display/Display
    * @implements WS.Data/Collection/IEnumerable
    * @implements WS.Data/Collection/IList
    * @implements WS.Data/Display/IBindCollection
    * @mixes WS.Data/Entity/SerializableMixin
    * @mixes WS.Data/Collection/EventRaisingMixin
    * @ignoreMethods notifyItemChange
    * @public
    * @author Мальцев Алексей
    */

   var Collection = Display.extend([IEnumerable, IList, IBindCollectionDisplay, SerializableMixin, EventRaisingMixin], /** @lends WS.Data/Display/Collection.prototype */{
      /**
       * @typedef {Object} UserSortItem
       * @property {WS.Data/Display/CollectionItem} item Элемент проекции
       * @property {*} collectionItem Элемент исходной коллекции
       * @property {Number} index Индекс элемента проекции
       * @property {Number} collectionIndex Индекс элемента исходной коллекции
       */

      /**
       * @event onBeforeCollectionChange Перед началом изменений коллекции
       */

      /**
       * @event onAfterCollectionChange После окончания изменений коллекции
       */

      _moduleName: 'WS.Data/Display/Collection',

      _sessionItemContentsGetter: 'getContents',

      /**
       * @cfg {WS.Data/Collection/IEnumerable} Исходная коллекция
       * @name WS.Data/Display/Collection#collection
       * @see getCollection
       */
      _$collection: null,

      /**
       * @cfg {Array.<Function(*, Number, WS.Data/Display/CollectionItem, Number): Boolean>|Function(*, Number, WS.Data/Display/CollectionItem, Number): Boolean} Пользовательские методы фильтрации элементов проекции: аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции. Должен вернуть Boolean - признак, что элемент удовлетворяет условиям фильтрации.
       * @name WS.Data/Display/Collection#filter
       * @example
       * Отберем персонажей женского пола:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list,
       *             filter: function(collectionItem) {
       *                return collectionItem.gender === 'F';
       *             }
       *          });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().name);
       *       });
       *       //output: 'Turanga Leela', 'Amy Wong'
       *    });
       * </pre>
       * @see getFilter
       * @see setFilter
       * @see addFilter
       * @see removeFilter
       */
      _$filter: null,

      /**
       * @cfg {Function(*, Number, WS.Data/Display/CollectionItem): String} Метод группировки элементов проекции
       * @name WS.Data/Display/Collection#group
       * @see getGroup
       * @see setGroup
       */
      _$group: null,

      /**
       * @cfg {Array.<Function(UserSortItem, UserSortItem): Number>|Function(UserSortItem, UserSortItem): Number} Пользовательские методы сортировки элементов: аргументами приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
       * @name WS.Data/Display/Collection#sort
       * @example
       * Отсортируем коллекцию по возрастанию значения поля title:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var display = new CollectionDisplay({
       *          collection: new List({
       *             items: [
       *                {id: 1, title: 'foo'},
       *                {id: 2, title: 'bar'}
       *             ]
       *          }),
       *          sort: function(a, b) {
       *             return a.collectionItem.title - b.collectionItem.title;
       *          }
       *       });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().title;
       *       });
       *       //output: 'bar', 'foo'
       *    });
       * </pre>
       * @see getSort
       * @see setSort
       * @see addSort
       * @see removeSort
       */
      _$sort: null,

      /**
       * @cfg {Array.<String>} Названия свойств элемента коллекции, от которых зависят фильтрация, сортировка, группировка.
       * @name WS.Data/Display/Collection#importantItemProperties
       * @remark
       * Изменение любого из указанных свойств элемента коллекции приведет к перерасчету фильтрации, сортировки и группировки.
       */
      _$importantItemProperties: null,

      /**
       * @member {String|Function} Тип элемента проекции
       */
      _itemModule: 'display.collection-item',

      /**
       * @member {WS.Data/Display/ItemsStrategy/Abstract} Стратегия получения элементов проекции
       */
      _itemsStrategy: null,

      /**
       * @member {Boolean} Исходная коллекция синхронизирована с проекцией (все события, приходящие от нее, соответсвуют ее состоянию)
       */
      _sourceCollectionSynchronized: true,

      /**
       * @member {Array.<Function>} Обработчики событий исходной коллекции, отложенные до момента синхронизации
       */
      _sourceCollectionDelayedCallbacks: null,

      /**
       * @member {Array.<Boolean>} Результат применения фильтра: индекс в коллекции -> прошел фильтр
       */
      _filterMap: null,

      /**
       * @member {Array.<String>} Группы
       */
      _groups: null,

      /**
       * @member {Array.<Number>} Результат применения группировки: индекс в коллекции -> индекс группы
       */
      _groupMap: null,

      /**
       * @member {Array.<Object>} Доступные способы сортировки
       */
      _sorters: null,

      /**
       * @member {Array.<Number>} Результат применения сортировки: индекс в проекции -> индекс в коллекции
       */
      _sortMap: null,

      /**
       * @member {Boolean|undefined} Признак, что порядок элементов отличается от исходной коллекции
       */
      _isSortedCache: undefined,

      /**
       * @member {WS.Data/Display/CollectionEnumerator} Служебный энумератор проекции - для организации курсора
       */
      _cursorEnumerator: null,

      /**
       * @member {WS.Data/Display/CollectionEnumerator} Служебный энумератор проекции - для поиска по свойствам и поиска следующего или предыдущего элемента относительно заданного
       */
      _utilityEnumerator: null,

      /**
       * @member {Function} Обработчик события об изменении исходной коллекции
       */
      _onSourceCollectionChange: null,

      /**
       * @member {Function} Обработчик события об изменении элемента исходной коллекции
       */
      _onSourceCollectionItemChange: null,

      /**
       * @member {Function} Обработчик события об изменении генерации событий исходной коллекции
       */
      _onSourceCollectionEventRaisingChange: null,

      constructor: function $Collection(options) {
         this._$importantItemProperties = [];
         this._$filter = [];
         this._$sort = [];
         this._filterMap = [];
         this._sortMap = [];
         this._groups = [];
         this._groupMap = [];

         Collection.superclass.constructor.call(this, options);
         EventRaisingMixin.constructor.call(this, options);

         if (!this._$collection) {
            throw new Error(this._moduleName + ': source collection is undefined');
         }
         if (this._$collection instanceof Array) {
            this._$collection = Di.create('collection.list', {items: this._$collection});
         }
         if (!CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Collection/IEnumerable')) {
            throw new TypeError(this._moduleName + ': source collection should implement WS.Data/Collection/IEnumerable');
         }

         if (typeof this._$sort === 'function') {
            this._$sort = [this._$sort];
         }
         this._$sort = CollectionHelpers.filter(this._$sort instanceof Array ? this._$sort : [], function(item) {
            return typeof item === 'function';
         });

         if (typeof this._$filter === 'function') {
            this._$filter = [this._$filter];
         }
         this._$filter = CollectionHelpers.filter(this._$filter instanceof Array ? this._$filter : [], function(item) {
            return typeof item === 'function';
         });

         this._publish('onCurrentChange', 'onCollectionChange', 'onCollectionItemChange', 'onBeforeCollectionChange', 'onAfterCollectionChange');

         this._initSorters();
         this._switchSortersByUserSort();
         this.switchSorter('group', this._isGrouped());

         this._reBuild();
         this._bindHandlers();
         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Collection/IBind')) {
            this._$collection.subscribe('onCollectionChange', this._onSourceCollectionChange);
            this._$collection.subscribe('onCollectionItemChange', this._onSourceCollectionItemChange);
         }
         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Collection/EventRaisingMixin')) {
            this._$collection.subscribe('onEventRaisingChange', this._onSourceCollectionEventRaisingChange);
         }
      },

      destroy: function () {
         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Collection/IBind')) {
            this._$collection.unsubscribe('onCollectionChange', this._onSourceCollectionChange);
            this._$collection.unsubscribe('onCollectionItemChange', this._onSourceCollectionItemChange);
         }
         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Collection/EventRaisingMixin')) {
            this._$collection.unsubscribe('onEventRaisingChange', this._onSourceCollectionEventRaisingChange);
         }

         this._unbindHandlers();
         this._itemsStrategy = null;
         this._filterMap = [];
         this._sortMap = [];
         this._cursorEnumerator = null;
         this._utilityEnumerator = null;

         Collection.superclass.destroy.call(this);
      },

      //region mutable

      /**
       * Возвращает элемент проекции с указанным идентификатором экземпляра.
       * @param {String} instanceId Идентификатор экземпляра.
       * @return {WS.Data/Display/CollectionItem}
       * @state mutable
       */
      getByInstanceId: function(instanceId) {
         return this.at(
            this._getUtilityEnumerator().getIndexByValue('instanceId', instanceId)
         );
      },

      /**
       * Возвращает индекс элемента проекции с указанным идентификатором экземпляра.
       * @param {String} instanceId Идентификатор экземпляра.
       * @return {Number}
       * @state mutable
       */
      getIndexByInstanceId: function (instanceId) {
         return this._getUtilityEnumerator().getIndexByValue('instanceId', instanceId);
      },

      //endregion mutable

      //region WS.Data/Collection/IEnumerable

      /**
       * Возвращает энумератор для перебора элементов проекции
       * @return {WS.Data/Display/CollectionEnumerator}
       */
      getEnumerator: function () {
         return this._getEnumerator();
      },

      /**
       * Перебирает все элементы проекции, начиная с первого.
       * @param {Function(WS.Data/Display/CollectionItem, Number, Number|String)} callback Ф-я обратного вызова для каждого элемента коллекции (аргументами придут элемент коллекции, его порядковый номер и идентификатор группы, в которую он входит)
       * @param {Object} [context] Контекст вызова callback
       * @example
       * Сгруппируем персонажей по полу:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *
       *       display.setGroup(function(collectionItem, index, item) {
       *          return collectionItem.gender;
       *       });
       *
       *       display.each(function(item, index, group) {
       *          console.log(group + ': ' + item.getContents().name);
       *       });
       *       //output: 'M: Philip J. Fry', 'M: Professor Farnsworth', 'F: Turanga Leela', 'F: Amy Wong', 'R: Bender Bending Rodríguez'
       *    });
       * </pre>
       */
      each: function (callback, context) {
         var enumerator = this.getEnumerator(),
            index;
         while (enumerator.moveNext()) {
            index = enumerator.getCurrentIndex();
            callback.call(
               context,
               enumerator.getCurrent(),
               index,
               this.getGroupByIndex(index)
            );
         }
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Collection/IList

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
         return this._getUtilityEnumerator().at(index);
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

      move: function () {
         throw new Error(_private.MESSAGE_READ_ONLY);
      },

      getIndex: function (item) {
         if (!(item instanceof CollectionItem)) {
            return -1;
         }
         return this.getIndexByInstanceId(item.getInstanceId());
      },

      getCount: function () {
         return this._getUtilityEnumerator().getCount();
      },

      //endregion WS.Data/Collection/IList

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state = SerializableMixin._getSerializableState.call(this, state);

         state.items = this._getItems();

         return state;
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            var items = this._getItems();
            items.length = 0;
            Array.prototype.push.apply(items, state.items);

            for (var i = 0, count = items.length; i < count; i++) {
               items[i].setOwner(this);
            }

            this._reIndex();
            this._reAnalize();
         });
      },

      //endregion WS.Data/Entity/SerializableMixin

      //region Public methods

      //region Access

      /**
       * Возвращает исходную коллекцию, для которой построена проекция
       * @return {WS.Data/Collection/IEnumerable}
       * @see collection
       */
      getCollection: function () {
         return this._$collection;
      },

      /**
       * Возвращает элементы проекции (без учета сортировки, фильтрации и группировки)
       * @return {Array.<WS.Data/Display/CollectionItem>}
       */
      getItems: function () {
         return this._getItems().slice();
      },

      //endregion Access

      //region Navigation

      /**
       * Возвращает текущий элемент
       * @return {WS.Data/Display/CollectionItem}
       */
      getCurrent: function () {
         return this._getCursorEnumerator().getCurrent();
      },

      /**
       * Устанавливает текущий элемент
       * @param {WS.Data/Display/CollectionItem} item Новый текущий элемент
       * @param {Boolean} [silent=false] Не генерировать событие onCurrentChange
       */
      setCurrent: function (item, silent) {
         var oldCurrent = this.getCurrent();
         if (oldCurrent !== item) {
            var enumerator = this._getCursorEnumerator(),
               oldPosition = this.getCurrentPosition();
            enumerator.setCurrent(item);

            if (!silent) {
               this._notifyCurrentChange(
                  this.getCurrent(),
                  oldCurrent,
                  enumerator.getPosition(),
                  oldPosition
               );
            }
         }
      },

      /**
       * Возвращает позицию текущего элемента
       * @return {Number}
       */
      getCurrentPosition: function () {
         return this._getCursorEnumerator().getPosition();
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
            this._getCursorEnumerator().setPosition(position);
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
       * @param {WS.Data/Display/CollectionItem} item элемент проекции
       * @return {WS.Data/Display/CollectionItem}
       */
      getNext: function (item) {
         return this._getNearbyItem(item, true);
      },

      /**
       * Возвращает предыдущий элемент относительно item
       * @param {WS.Data/Display/CollectionItem} index элемент проекции
       * @return {WS.Data/Display/CollectionItem}
       */
      getPrevious: function (item) {
         return this._getNearbyItem(item, false);
      },

      /**
       * Устанавливает текущим следующий элемент
       * @return {Boolean} Есть ли следующий элемент
       */
      moveToNext: function () {
         var oldCurrent = this.getCurrent(),
             oldCurrentPosition = this.getCurrentPosition(),
             hasNext = this._getCursorEnumerator().moveNext();
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
       * @return {Boolean} Есть ли предыдущий элемент
       */
      moveToPrevious: function () {
         var oldCurrent = this.getCurrent(),
             oldCurrentPosition = this.getCurrentPosition(),
             hasPrevious = this._getCursorEnumerator().getPrevious() ? true : false;
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
       * @return {Boolean} Есть ли первый элемент
       */
      moveToFirst: function () {
         if (this.getCurrentPosition() === 0) {
            return false;
         }
         this.setCurrentPosition(0);
         return this._getCursorEnumerator().getPosition() === 0;
      },

      /**
       * Устанавливает текущим последний элемент
       * @return {Boolean} Есть ли последний элемент
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
       * Возвращает индекс элемента в исходной коллекции по его индексу в проекции
       * @param {Number} index Индекс элемента в проекции
       * @return {Number} Индекс элемента в исходной коллекции
       */
      getSourceIndexByIndex: function (index) {
         var sourceIndex = this._getUtilityEnumerator().getSourceByInternal(index);
         sourceIndex = sourceIndex === undefined || sourceIndex === null ? -1 : sourceIndex;
         return this._getSourceIndex(sourceIndex);
      },

      /**
       * Возвращает индекс элемента проекции в исходной коллекции
       * @param {WS.Data/Display/CollectionItem} item Элемент проекции
       * @return {Number} Индекс элемента проекции в исходной коллекции
       */
      getSourceIndexByItem: function (item) {
         var index = this.getIndex(item);
         return index == -1 ? -1 : this.getSourceIndexByIndex(index);
      },

      /**
       * Возвращает индекс элемента в проекции по индексу в исходной коллекции
       * @param {Number} index Индекс элемента в исходной коллекции
       * @return {Number} Индекс элемента в проекции
       */
      getIndexBySourceIndex: function (index) {
         index = this._getItemIndex(index);
         var itemIndex = this._getUtilityEnumerator().getInternalBySource(index);
         return itemIndex === undefined || itemIndex === null ? -1 : itemIndex;
      },

      /**
       * Возвращает позицию элемента исходной коллекции в проекции.
       * @param {*} item Элемент исходной коллекции
       * @return {Number} Позвиция элемента в проекции или -1, если не входит в проекцию
       */
      getIndexBySourceItem: function (item) {
         var collection = this.getCollection(),
            sourceIndex = -1;

         if (collection && collection._wsDataCollectionIList) {//it's equal to CoreInstance.instanceOfMixin(collection, 'WS.Data/Collection/IList')
            sourceIndex = collection.getIndex(item);
         } else {
            collection.each(function(value, index) {
               if (sourceIndex === -1 && value === item) {
                  sourceIndex = index;
               }
            });
         }
         return sourceIndex === -1 ? -1 : this.getIndexBySourceIndex(sourceIndex);
      },

      /**
       * Возвращает элемент проекции по индексу исходной коллекции.
       * @param {Number} index Индекс элемента в исходной коллекции
       * @return {WS.Data/Display/CollectionItem} Элемент проекции или undefined, если index не входит в проекцию
       */
      getItemBySourceIndex: function (index) {
         index = this.getIndexBySourceIndex(index);
         return index == -1 ? undefined : this.at(index);
      },

      /**
       * Возвращает элемент проекции для элемента исходной коллекции.
       * @param {*} item Элемент исходной коллекции
       * @return {WS.Data/Display/CollectionItem} Элемент проекции или undefined, если item не входит в проекцию
       */
      getItemBySourceItem: function (item) {
         var index = this.getIndexBySourceItem(item);
         return index == -1 ? undefined : this.at(index);
      },

      //endregion Navigation

      //region Changing

      /**
       * Возвращает пользовательские методы фильтрации элементов проекции
       * @return {Array.<Function(*, Number, WS.Data/Display/CollectionItem, Number): Boolean>}
       * @see filter
       * @see setFilter
       * @see addFilter
       * @see removeFilter
       */
      getFilter: function () {
         return this._$filter.slice();
      },

      /**
       * Устанавливает пользовательские методы фильтрации элементов проекции. Вызов метода без аргументов приведет к удалению всех пользовательских фильтров.
       * @param {...Function(*, Number, WS.Data/Display/CollectionItem, Number): Boolean} [filter] Методы фильтрации элементов: аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции. Должен вернуть Boolean - признак, что элемент удовлетворяет условиям фильтрации.
       * @see filter
       * @see getFilter
       * @see addFilter
       * @see removeFilter
       * @example
       * Отберем персонажей женского пола:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *
       *       display.setFilter(function(collectionItem, index, item) {
       *          return collectionItem.gender === 'F';
       *       });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().name);
       *       });
       *       //output: 'Turanga Leela', 'Amy Wong'
       *    });
       * </pre>
       */
      setFilter: function () {
         var filters;
         if (arguments[0] instanceof Array) {
            filters = arguments[0];
         } else {
            filters = Array.prototype.slice.call(arguments);
         }

         if (this._$filter.length === filters.length) {
            var changed = false;
            for (var i = 0; i < filters.length; i++) {
               if (this._$filter[i] !== filters[i]) {
                  changed = true;
                  break;
               }
            }

            if (!changed) {
               return;
            }
         }

         this._$filter = CollectionHelpers.filter(filters, function(item) {
            return typeof item === 'function';
         });

         var session = this._startUpdateSession();
         this._reFilter();
         this._finishUpdateSession(session);
      },

      /**
       * Добавляет пользовательский метод фильтрации элементов проекции, если такой еще не был задан.
       * @param {Function(*, Number, WS.Data/Display/CollectionItem, Number): Boolean} filter Метод фильтрации элементов: аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции. Должен вернуть Boolean - признак, что элемент удовлетворяет условиям фильтрации.
       * @param {Number} [at] Порядковый номер метода (если не передан, добавляется в конец)
       * @see filter
       * @see getFilter
       * @see setFilter
       * @see removeFilter
       * @example
       * Отберем персонажей женского пола:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *
       *       display.addFilter(function(collectionItem, index, item) {
       *          return collectionItem.gender === 'F';
       *       });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().name);
       *       });
       *       //output: 'Turanga Leela', 'Amy Wong'
       *    });
       * </pre>
       */
      addFilter: function (filter, at) {
         if (this._$filter.indexOf(filter) > -1) {
            return;
         }
         if (at === undefined) {
            this._$filter.push(filter);
         } else {
            this._$filter.splice(at, 0, filter);
         }

         var session = this._startUpdateSession();
         this._reFilter();
         this._finishUpdateSession(session);
      },

      /**
       * Удаляет пользовательский метод фильтрации элементов проекции.
       * @param {Function(*, Number, WS.Data/Display/CollectionItem, Number): Boolean} filter Метод фильтрации элементов: аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции. Должен вернуть Boolean - признак, что элемент удовлетворяет условиям фильтрации.
       * @return {Boolean} Был ли установлен такой метод фильтрации
       * @see filter
       * @see getFilter
       * @see setFilter
       * @see addFilter
       * @example
       * Уберем фильтрацию персонажей по полу:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var filter = function(collectionItem, index, item) {
       *             return collectionItem.gender === 'F';
       *          }),
       *          list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list,
       *             filter: filter
       *          });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().name);
       *       });
       *       //output: 'Turanga Leela', 'Amy Wong'
       *
       *       display.removeFilter(filter);
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().name);
       *       });
       *       //output: 'Philip J. Fry', 'Turanga Leela', 'Professor Farnsworth', 'Amy Wong', 'Bender Bending Rodríguez'
       *    });
       * </pre>
       */
      removeFilter: function (filter) {
         var at = this._$filter.indexOf(filter);
         if (at === -1) {
            return false;
         }

         this._$filter.splice(at, 1);

         var session = this._startUpdateSession();
         this._reFilter();
         this._finishUpdateSession(session);

         return true;
      },

      /**
       * Возвращает метод группировки элементов проекции
       * @return {Function}
       * @see group
       * @see setGroup
       */
      getGroup: function () {
         return this._$group;
      },

      /**
       * Устанавливает метод группировки элементов проекции. Для сброса ранее установленной группировки следует вызвать этот метод без параметров.
       * @param {Function(*, Number, WS.Data/Display/CollectionItem): String} [group] Метод группировки элементов: аргументами приходят элемент коллекции, его позиция, элемент проекции. Должен вернуть String|Number - группу, в которую входит элемент.
       * @see group
       * @see getGroup
       * @example
       * Сгруппируем персонажей по полу:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *
       *       display.setGroup(function(collectionItem, index, item) {
       *          return collectionItem.gender;
       *       });
       *
       *       display.each(function(item, index, group) {
       *          console.log(group + ': ' + item.getContents().name);
       *       });
       *       //output: 'M: Philip J. Fry', 'M: Professor Farnsworth', 'F: Turanga Leela', 'F: Amy Wong', 'R: Bender Bending Rodríguez'
       *    });
       * </pre>
       */
      setGroup: function (group) {
         if (this._$group === group) {
            return;
         }
         
         var session = this._startUpdateSession();
         this._$group = group;
         this.switchSorter('group', this._isGrouped());
         this._reGroup();
         this._reSort();
         this._finishUpdateSession(session);
      },

      /**
       * Возвращает элементы группы. Учитывается сортировка и фильтрация.
       * @param {String} groupId Идентификатор группы, элементы которой требуется получить
       * @return {Array.<WS.Data/Display/CollectionItem>}
       * @example
       * Получим персонажей мужского пола:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *
       *       display.setGroup(function(collectionItem, index, item) {
       *          return collectionItem.gender;
       *       });
       *
       *       var males = display.getGroupItems('M'),
       *          male,
       *          i;
       *       for (i = 0; i < males.length; i++) {
       *          male = males[i].getContents();
       *          console.log(male.name);
       *       }
       *       //output: 'Philip J. Fry', 'Professor Farnsworth'
       *    });
       * </pre>
       */
      getGroupItems: function (groupId) {
         var filterMap = this._filterMap,
            sortMap = this._sortMap,
            groupMap = this._groupMap,
            groupIndex = this._getGroupIndexById(groupId),
            groupItems = [],
            items = this._getItems(),
            index,
            sortedIndex;

         if (groupIndex > -1) {
            for (index = 0; index < groupMap.length; index++) {
               if (groupMap[index] === groupIndex && filterMap[index]) {
                  sortedIndex = sortMap.indexOf(index);
                  if (sortedIndex > -1) {
                     groupItems.push(sortedIndex);
                  }
               }
            }
            groupItems.sort(function (a, b) {
               return a - b;
            });
         }

         return CollectionHelpers.map(groupItems, function(sortedIndex) {
            return items[sortMap[sortedIndex]];
         });
      },

      /**
       * Возвращает идентификтор группы по индексу элемента в проекции
       * @param {Number} index Индекс элемента в проекции
       * @return {String|Number}
       * @example
       * Сгруппируем персонажей по полу:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var list = new List({
       *             items: [
       *                {name: 'Philip J. Fry', gender: 'M'},
       *                {name: 'Turanga Leela', gender: 'F'},
       *                {name: 'Professor Farnsworth', gender: 'M'},
       *                {name: 'Amy Wong', gender: 'F'},
       *                {name: 'Bender Bending Rodríguez', gender: 'R'}
       *             ]
       *          }),
       *          display = new CollectionDisplay({
       *             collection: list
       *          });
       *
       *       display.setGroup(function(collectionItem, index, item) {
       *          return collectionItem.gender;
       *       });
       *
       *       var enumerator = display.getEnumerator(),
       *          index = 0,
       *          item,
       *          group,
       *          contents;
       *       while (enumerator.moveNext()) {
       *          item = enumerator.getCurrent();
       *          group = display.getGroupByIndex(index);
       *          contents = item.getContents();
       *          console.log(group + ': ' + contents.name);
       *          index++;
       *       }
       *       //output: 'M: Philip J. Fry', 'M: Professor Farnsworth', 'F: Turanga Leela', 'F: Amy Wong', 'R: Bender Bending Rodríguez'
       *    });
       * </pre>
       */
      getGroupByIndex: function (index) {
         var groupIndex = this._getGroupIndexByIndex(index);
         return this._getGroupIdByIndex(groupIndex);
      },

      /**
       * Возвращает пользовательские методы сортировки элементов проекции
       * @return {Array.<Function>}
       * @see sort
       * @see setSort
       * @see addSort
       */
      getSort: function () {
         return this._$sort.slice();
      },

      /**
       * Устанавливает пользовательские методы сортировки элементов проекции. Вызов метода без аргументов приведет к удалению всех пользовательских сортировок.
       * @param {...Function(UserSortItem, UserSortItem): Number} [sort] Методы сортировки элементов: аргументами приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
       * @see sort
       * @see getSort
       * @see addSort
       * @see removeSort
       * @example
       * Отсортируем коллекцию по возрастанию значения поля title:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var display = new CollectionDisplay({
       *          collection: new List({
       *             items: [
       *                {id: 1, title: 'foo'},
       *                {id: 2, title: 'bar'}
       *             ]
       *          })
       *       });
       *
       *       display.setSort(function(a, b) {
       *          return a.collectionItem.title > b.collectionItem.title;
       *       });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().title;
       *       });
       *       //output: 'bar', 'foo'
       *    });
       * </pre>
       * Отсортируем коллекцию сначала по title, а потом - по id:
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var display = new CollectionDisplay({
       *          collection: new List({
       *             items: [
       *                {id: 4, title: 'foo'},
       *                {id: 3, title: 'bar'},
       *                {id: 2, title: 'foo'}
       *             ]
       *          })
       *       });
       *
       *       display.setSort(function(a, b) {
       *          return a.collectionItem.title > b.collectionItem.title;
       *       }, function(a, b) {
       *          return a.collectionItem.id - b.collectionItem.id;
       *       });
       *
       *       display.each(function(item) {
       *          console.log(item.getContents().id;
       *       });
       *       //output: 3, 2, 4
       *    });
       * </pre>
       */
      setSort: function () {
         var sorts;
         if (arguments[0] instanceof Array) {
            sorts = arguments[0];
         } else {
            sorts = Array.prototype.slice.call(arguments);
         }

         if (this._$sort.length === sorts.length) {
            var changed = false;
            for (var i = 0; i < sorts.length; i++) {
               if (this._$sort[i] !== sorts[i]) {
                  changed = true;
                  break;
               }
            }

            if (!changed) {
               return;
            }
         }

         this._$sort = CollectionHelpers.filter(sorts, function(item) {
            return typeof item === 'function';
         });

         var session = this._startUpdateSession();
         this._switchSortersByUserSort();
         this._reSort();
         if (this._isFiltered()) {
            this._reFilter();
         }
         this._finishUpdateSession(session);
      },

      /**
       * Добавляет пользовательский метод сортировки элементов проекции, если такой еще не был задан.
       * @param {Function(UserSortItem, UserSortItem): Number} [sort] Метод сортировки элементов: аргументами приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
       * @param {Number} [at] Порядковый номер метода (если не передан, добавляется в конец)
       * @see sort
       * @see getSort
       * @see setSort
       * @see removeSort
       * @example
       * Отсортируем коллекцию по возрастанию значения поля id
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var display = new CollectionDisplay({
       *          collection: new List({
       *             items: [
       *                {id: 1, title: 'foo'},
       *                {id: 2, title: 'bar'}
       *             ]
       *          })
       *       });
       *
       *       display.addSort(function(a, b) {
       *          return a.collectionItem.id - b.collectionItem.id
       *       });
       *    });
       * </pre>
       */
      addSort: function (sort, at) {
         if (this._$sort.indexOf(sort) > -1) {
            return;
         }
         if (at === undefined) {
            this._$sort.push(sort);
         } else {
            this._$sort.splice(at, 0, sort);
         }

         var session = this._startUpdateSession();
         this._switchSortersByUserSort();
         this._reSort();
         if (this._isFiltered()) {
            this._reFilter();
         }
         this._finishUpdateSession(session);
      },

      /**
       * Удаляет пользовательский метод сортировки элементов проекции.
       * @param {Function(UserSortItem, UserSortItem): Number} [sort] Метод сортировки элементов: аргументами приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
       * @return {Boolean} Был ли установлен такой метод сортировки
       * @see sort
       * @see getSort
       * @see setSort
       * @see addSort
       * @example
       * Отсортируем коллекцию по возрастанию значения поля id
       * <pre>
       *    define([
       *       'js!WS.Data/Collection/List'
       *       'js!WS.Data/Display/Collection'
       *    ], function(List, CollectionDisplay) {
       *       var handler = function(a, b) {
       *             return a.item.id - b.item.id
       *          },
       *          display = new CollectionDisplay({
       *             collection: new List({
       *                items: [
       *                   {id: 1, title: 'foo'},
       *                   {id: 2, title: 'bar'}
       *                ]
       *             }),
       *             sort: handler
       *          });
       *
       *       //...
       *       display.removeSort(handler);
       *    });
       * </pre>
       */
      removeSort: function (sort) {
         var at = this._$sort.indexOf(sort);
         if (at === -1) {
            return false;
         }

         this._$sort.splice(at, 1);

         var session = this._startUpdateSession();
         this._switchSortersByUserSort();
         this._reSort();
         if (this._isFiltered()) {
            this._reFilter();
         }
         this._finishUpdateSession(session);

         return true;
      },

      /**
       * Включает-выключает способ сортировки
       * @param {String} name Название способа сортировки
       * @param {Boolean} enabled Включен или выключен
       */
      switchSorter: function (name, enabled) {
         var applyImportantProps = function() {
               var item,
                  properties,
                  i,
                  j;

               for (i = 0; i < this._$sort.length; i++) {
                  item = this._$sort[i];
                  if (item.functor === ComputeFunctor) {
                     properties = item.properties;
                     for (j = 0; j < properties.length; j++) {
                        if (enabled) {
                           this._setImportantProperty(properties[j]);
                        } else {
                           this._unsetImportantProperty(properties[j]);
                        }
                     }
                  }
               }

            }.bind(this),
            hasAffect = false,
            sorter,
            i;

         for (i = 0; i < this._sorters.length; i++) {
            sorter = this._sorters[i];
            if (sorter.name === name && sorter.enabled !== enabled) {
               sorter.enabled = enabled;
               hasAffect = true;
               if (name === 'user') {
                  applyImportantProps();
               }
            }
         }

         if (hasAffect) {
            this._reSort();
         }
      },

      /**
       * Возвращает признак, включен ли способ сортировки
       * @param {String} name Название способа сортировки
       * @return {Boolean|undefined}
       */
      isSorterEnabled: function (name) {
         for (var i = 0; i < this._sorters.length; i++) {
            if (this._sorters[i].name === name) {
               return this._sorters[i].enabled;
            }
         }
      },

      /**
       * Уведомляет подписчиков об изменении элемента коллекции
       * @param {WS.Data/Display/CollectionItem} item Элемент проекции
       * @param {Object.<String, *>} [properties] Изменившиеся свойства
       */
      notifyItemChange: function (item, properties) {
         var isFiltered = this._isFiltered(),
            isGrouped = this._isGrouped();
         
         if (isFiltered || isGrouped) {
            var session;
            session = this._startUpdateSession();
            if (isGrouped) {
               this._reGroup();
               this._reSort();
            }
            if (isFiltered) {
               this._reFilter();
            }
            this._finishUpdateSession(session);
         }

         if (!this.isEventRaising()) {
            return;
         }

         this._notifyBeforeCollectionChange();
         this._notify(
            'onCollectionItemChange',
            item,
            this.getIndex(item),
            properties
         );
         this._notifyAfterCollectionChange();
      },

      //endregion Changing

      //endregion Public methods

      //region WS.Data/Collection/EventRaisingMixin

      _startUpdateSession: function () {
         var session = EventRaisingMixin._startUpdateSession.call(this);

         if (session && this._isGrouped()) {
            this._saveGroups(session.id, session.before);
         }

         return session;
      },

      _finishUpdateSession: function (session) {
         if (session) {
            this._notifyBeforeCollectionChange();
         }
         EventRaisingMixin._finishUpdateSession.call(this, session, function() {
            if (session && this._isGrouped()) {
               this._saveGroups(session.id, session.after, true);
            }
         });
         if (session) {
            this._notifyAfterCollectionChange();
         }

         if (session && this._isGrouped()) {
            this._clearGroups(session.id, this._getItems());
         }
      },

      _saveGroups: function (id, items, after) {
         var afterGroupIndex = 'afterGroupIndex' + id,
            afterGroup = 'afterGroup' + id,
            beforeGroupIndex = 'beforeGroupIndex' + id,
            beforeGroup = 'beforeGroup' + id,
            groupIndex,
            item,
            i;
         for (i = 0; i < items.length; i++) {
            item = items[i];
            groupIndex = this._getGroupIndexByIndex(i);
            if (after) {
               item[afterGroupIndex] = groupIndex;
               item[afterGroup] = this._getGroupIdByIndex(groupIndex);
            } else {
               item[beforeGroupIndex] = groupIndex;
               item[beforeGroup] = this._getGroupIdByIndex(groupIndex);
            }
         }
      },

      _clearGroups: function (id, items) {
         var afterGroupIndex = 'afterGroupIndex' + id,
            afterGroup = 'afterGroup' + id,
            beforeGroupIndex = 'beforeGroupIndex' + id,
            beforeGroup = 'beforeGroup' + id,
            item,
            i;
         for (i = 0; i < items.length; i++) {
            item = items[i];
            delete item[beforeGroupIndex];
            delete item[beforeGroup];
            delete item[afterGroupIndex];
            delete item[afterGroup];
         }
      },

      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex, session) {
         if (!this._isNeedNotifyCollectionChange()) {
            return;
         }
         if (
            !session ||
            action === IBindCollectionDisplay.ACTION_RESET ||
            !this._isGrouped()
         ) {
            EventRaisingMixin._notifyCollectionChange.call(this, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            return;
         }
         
         var notify = function(start, finish, group) {
               this._notify(
                  'onCollectionChange',
                  action,
                  newItems.slice(start, finish),
                  newItems.length ? newItemsIndex + start : 0,
                  oldItems.slice(start, finish),
                  oldItems.length ? oldItemsIndex + start : 0,
                  group
               );
            },
            afterGroupIndex = 'afterGroupIndex' + session.id,
            afterGroup = 'afterGroup' + session.id,
            beforeGroupIndex = 'beforeGroupIndex' + session.id,
            beforeGroup = 'beforeGroup' + session.id,
            isRemove = action === IBindCollectionDisplay.ACTION_REMOVE,
            max = isRemove ? oldItems.length : newItems.length,
            group,
            prevGroup,
            groupIndex,
            prevIndex,
            notifyIndex = 0,
            i;
         
         for (i = 0; i < max; i++) {
            if (isRemove) {
               groupIndex = oldItems[i][beforeGroupIndex];
               group = oldItems[i][beforeGroup];
            } else {
               groupIndex = newItems[i][afterGroupIndex];
               group = newItems[i][afterGroup];
            }

            if (prevIndex === undefined) {
               prevIndex = groupIndex;
               prevGroup = group;
            }
            if (groupIndex !== prevIndex) {
               notify.call(this, notifyIndex, i, prevGroup);
               notifyIndex = i;
            }
            if (i === max - 1) {
               notify.call(this, notifyIndex, i + 1, group);
            }
            prevIndex = groupIndex;
            prevGroup = group;
         }
      },

      //endregion WS.Data/Collection/EventRaisingMixin

      //region Multiselectable

      /**
       * Возвращает массив выбранных элементов
       * @remark Метод возвращает выбранные элементы не зависимо от фильтра проекции.
       * @return {Array}
       */
      getSelectedItems: function() {
         var items = this._getItems(),
            result = [];
         for (var i = items.length - 1; i >= 0; i--) {
            if (items[i].isSelected()) {
               result.push(items[i]);
            }
         }
         return result;
      },

      /**
       * Устанавливает признак, что элемент выбран, переданным элементам.
       * @remark Метод зависит от фильтра проекции.
       * @param {Array} items Массив элементов исходной коллекции
       * @param {Boolean} selected Элемент выбран.
       * @example
       * <pre>
       *     var list = new List({...}),
       *        display = new CollectionDisplay({
       *           collection: list
       *        });
       *    display.setSelectedItems([list.at(0), list.at(1)], true) //установит признак двум элементам;
       * </pre>
       */
      setSelectedItems: function(items, selected) {
         var sourceItems = [];
         for (var i = 0, count = items.length; i < count; i++) {
            sourceItems.push(
               this.getItemBySourceItem(items[i])
            );
         }
         this._setSelectedItems(sourceItems, selected);
      },

      /**
       * Устанавливает признак, что элемент выбран, всем элементам проекции.
       * @remark Метод устанавливает  признак всем элементам не зависимо от фильтра проекции.
       * @param {Boolean} selected Элемент выбран.
       * @return {Array}
       */
      setSelectedItemsAll: function(selected) {
         this._setSelectedItems(this._getItems(), selected);
      },

      /**
       * Инвертирует признак, что элемент выбран, у всех элементов проекции
       * @remark Метод инвертирует выделение у всех элементов не зависимо от фильтра проекции.
       */
      invertSelectedItemsAll: function() {
         var items = this._getItems(),
            i;
         for (i = items.length - 1; i >= 0; i--) {
            items[i].setSelected(!items[i].isSelected(), true);
         }
         this._notifyCollectionChange(
            IBindCollectionDisplay.ACTION_RESET,
            items,
            0,
            items,
            0
         );
      },

      /**
       * Устанавливает признак, переданным, элементам проекции.
       * @param {Array} selecItems массив элементов проекции
       * @param {Boolean} selected Элемент выбран.
       */
      _setSelectedItems: function(selecItems, selected) {
         var items = [];
         selected = !!selected;
         for (var i = selecItems.length-1; i >= 0; i--){
            if (selecItems[i].isSelected() !== selected) {
               selecItems[i].setSelected(selected, true);
               items.push(selecItems[i]);
            }
         }
         if (items.length > 0) {
            var index = this.getIndex(items[0]);
            this._notifyCollectionChange(
               IBindCollectionDisplay.ACTION_REPLACE,
               items,
               index,
               items,
               index
            );
         }
      },

      //endregion Multiselectable

      //region Protected methods

      //region Access

      /**
       * Добавляет свойство в importantItemProperties, если его еще там нет
       * @param {String} name Название свойства
       * @protected
       */
      _setImportantProperty: function(name) {
         var index = this._$importantItemProperties.indexOf(name);
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
         var index = this._$importantItemProperties.indexOf(name);
         if (index !== -1) {
            this._$importantItemProperties.splice(index, 1);
         }
      },

      /**
       * Настраивает контекст обработчиков
       * @protected
       */
      _bindHandlers: function() {
         this._onSourceCollectionChange = _private.onSourceCollectionChange.bind(this);
         this._onSourceCollectionItemChange = _private.onSourceCollectionItemChange.bind(this);
         this._onSourceCollectionEventRaisingChange = _private.onSourceCollectionEventRaisingChange.bind(this);
      },

      _unbindHandlers: function() {
         this._onSourceCollectionChange = null;
         this._onSourceCollectionItemChange = null;
         this._onSourceCollectionEventRaisingChange = null;
      },

      //endregion Access

      //region Navigation

      /**
       * Возвращает элементы проекции
       * @return {Array.<WS.Data/Display/CollectionItem>}
       * @protected
       */
      _getItems: function () {
         return this._getItemsStrategy().getItems();
      },

      /**
       * Возвращает cтратегию получения элементов проекции
       * @return {WS.Data/Display/ItemsStrategy/Abstract}
       * @protected
       */
      _getItemsStrategy: function () {
         return this._itemsStrategy || (this._itemsStrategy = this._createItemsStrategy());
      },

      /**
       * Создает cтратегию получения элементов проекции
       * @return {WS.Data/Display/ItemsStrategy/Abstract}
       * @protected
       */
      _createItemsStrategy: function () {
         return new DirectItemsStrategy(this, {
            itemModule: this._itemModule
         });
      },

      /**
       * Возвращает энумератор
       * @param {Boolean} unlink Отвязать от состояния проекции
       * @return {WS.Data/Display/CollectionEnumerator}
       * @protected
       */
      _getEnumerator: function (unlink) {
         return this._buildEnumerator(
            unlink ? this._getItems().slice() : this._getItems(),
            unlink ? this._filterMap.slice() : this._filterMap,
            unlink ? this._sortMap.slice() : this._sortMap
         );
      },

      /**
       * Конструирует энумератор по входным данным
       * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции
       * @param {Array.<Boolean>} filterMap Фильтр: индекс в коллекции -> прошел фильтр
       * @param {Array.<WS.Data/Display/CollectionItem>} sortMap Сортировка: индекс в проекции -> индекс в коллекции
       * @return {WS.Data/Display/CollectionEnumerator}
       * @protected
       */
      _buildEnumerator: function (items, filterMap, sortMap) {
         return new CollectionEnumerator({
            items: items,
            filterMap: filterMap,
            sortMap: sortMap
         });
      },

      /**
       * Возвращает служебный энумератор для организации курсора
       * @return {WS.Data/Display/CollectionEnumerator}
       * @protected
       */
      _getCursorEnumerator: function () {
         return this._cursorEnumerator || (this._cursorEnumerator = this._getEnumerator());
      },

      /**
       * Возвращает служебный энумератор для для поиска по свойствам и поиска следующего или предыдущего элемента относительно заданного
       * @return {WS.Data/Display/CollectionEnumerator}
       * @protected
       */
      _getUtilityEnumerator: function() {
         return this._utilityEnumerator || (this._utilityEnumerator = this._getEnumerator());
      },

      /**
       * Возвращает соседний элемент проекции
       * @param {WS.Data/Display/CollectionItem} item Элемент проекции относительно которого искать
       * @param {Boolean} isNext Следующий или предыдущий элемент
       * @return {WS.Data/Display/CollectionItem}
       * @protected
       */
      _getNearbyItem: function (item, isNext) {
         var enumerator = this._getUtilityEnumerator();
         enumerator.setCurrent(item);
         var nearbyItem = this._getUtilityEnumerator()[isNext ? 'getNext' : 'getPrevious'](item);

         return nearbyItem;
      },

      /**
       * Возвращает индекс элемента в _getItems(), оборачивающий элемент исходной коллекции с индексом index
       * @param {Number} sourceIndex Индекс элемента в исходной коллекции
       * @return {Number}
       * @protected
       */
      _getItemIndex: function (sourceIndex) {
         return sourceIndex;
      },

      /**
       * Возвращает индекс элемента в исходной коллекци, который оборачивается элементом из _getItems() с индексом index
       * @param {Number} index Индекс элемента в _getItems()
       * @return {Number}
       * @protected
       */
      _getSourceIndex: function (index) {
         return index;
      },

      //endregion Navigation

      //region Calculation

      /**
       * Перерасчитывает все данные заново
       * @param {Boolean} [reset=false] Сбросить все созданные элементы
       * @protected
       */
      _reBuild: function (reset) {
         this._groupMap.length = 0;
         this._groups.length = 0;
         this._filterMap.length = 0;
         this._reIndex();

         var itemsStrategy = this._getItemsStrategy(),
            count,
            index;

         if (reset) {
            itemsStrategy.reset();
         }

         count = itemsStrategy.getCount();
         for (index = 0; index < count; index++) {
            this._filterMap.push(true);
         }

         if (this._isGrouped()) {
            this._reGroup();
         }
         this._reSort();
         if (this._isFiltered()) {
            this._reFilter();
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
         count = count || this._getItemsStrategy().getCount() - start;

         var session = this._startUpdateSession();
         this._reGroup(start, count);
         this._reSort();
         this._reFilter(start, count);
         this._finishUpdateSession(session);
      },

      /**
       * Вызывает переиндексацию
       * @protected
       */
      _reIndex: function () {
         this._getCursorEnumerator().reIndex();
         this._getUtilityEnumerator().reIndex();
         this._isSortedCache = undefined;
      },

      /**
       * Проверяет, что исходная коллекция искажается проекцией
       * @return {Boolean}
       * @protected
       */
      _isFalseMirror: function () {
         return this._isFiltered() || this._isSorted() || this._isGrouped();
      },

      //endregion Calculation

      //region Changing

      /**
       * Производит фильтрацию для среза элементов
       * @param {Number} [start=0] Начальный индекс
       * @param {Number} [count] Кол-во элементов (по умолчанию - все элементы)
       * @protected
       */
      _reFilter: function (start, count) {
         start = start || 0;
         count = count || this._getItemsStrategy().getCount() - start;

         var filters = this._$filter,
            filtersLength = filters.length,
            filterIndex,
            filter,
            items = this._getItems(),
            sortMap = this._sortMap,
            finish = start + count,
            changed = false,
            item,
            index,
            match,
            oldMatch;

         for (index = start; index < finish; index++) {
            item = items[index];
            oldMatch = this._filterMap[index];
            match = true;

            for (filterIndex = 0; filterIndex < filtersLength; filterIndex++) {
               filter = filters[filterIndex];

               match = filter(
                  item.getContents(),
                  index,
                  item,
                  filter.length > 3 ? sortMap.indexOf(index) : undefined
               );
               if (!match) {
                  break;
               }
            }

            if (match !== oldMatch) {
               if (match) {
                  this._filterMap[index] = match;
                  changed = true;
               } else if (oldMatch !== undefined) {
                  this._filterMap[index] = match;
                  changed = true;
               }
            }
         }

         if (changed) {
            this._reIndex();
         }
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
       * Инициализирует сортировщики
       * @protected
       */
      _initSorters: function () {
         this._sorters = [{
            name: 'user',
            enabled: false,
            method: _private.sorters.user,
            options: function() {
               return {
                  userSort: this._$sort
               };
            }
         }, {
            name: 'group',
            enabled: false,
            method: _private.sorters.group,
            options: function() {
               return {
                  groupMap: this._groupMap
               };
            }
         }];

         this._getItemsStrategy().addSorters(this._sorters);
      },

      /**
       * Переключает сортировики, зависящие от наличия пользовательской сортировки
       * @protected
       */
      _switchSortersByUserSort: function () {
         var isUserSorted = this._isUserSorted();
         this.switchSorter('natural', !isUserSorted);
         this.switchSorter('user', isUserSorted);
      },

      /**
       * Производит построение sortMap
       * @return {Array.<Number>}
       * @protected
       */
      _buildSortMap: function () {
         var i,
            sorter,
            items = this._getItems(),
            result = [];

         for (i = 0; i < this._sorters.length; i++) {
            sorter = this._sorters[i];
            if (sorter.enabled) {
               result = sorter.method.call(
                  null,
                  items,
                  result,
                  (typeof sorter.options === 'function' ? sorter.options.call(this) : sorter.options) || {}
               );
            }
         }

         return result;
      },

      /**
       * Производит группировку для среза элементов
       * @param {Number} [start=0] Начальный индекс
       * @param {Number} [count] Кол-во элементов (по умолчанию - все элементы)
       * @protected
       */
      _reGroup: function (start, count) {
         start = start || 0;
         count = count || this._getItemsStrategy().getCount() - start;

         var shiftUp = function(index) {
               return index >= groupIndex ? 1 + index : index;
            },
            items = this._getItems(),
            finish = start + count,
            prevIndex = CollectionHelpers.reduce(this._groupMap.slice(0, start), function(prev, curr) {
               return Math.max(prev, curr);
            }, -1),
            item,
            groupId,
            groupIndex,
            hasChanges;

         for (var index = start; index < finish; index++) {
            item = items[index];
            groupId = this._$group ? this._$group(item.getContents(), index, item) : undefined;
            groupIndex = this._getGroupIndexById(groupId);
            if (groupIndex === -1) {
               groupIndex = 1 + prevIndex;
               this._groups.splice(groupIndex, 0, groupId);
               this._groupMap = CollectionHelpers.map(this._groupMap, shiftUp);
            }
            if (this._groupMap[index] !== groupIndex) {
               hasChanges = true;
            }
            this._groupMap[index] = groupIndex;
            prevIndex = Math.max(prevIndex, groupIndex);
         }

         if (hasChanges) {
            this._reIndex();
         }
      },

      /**
       * Проверяет, что используется фильтрация
       * @return {Boolean}
       * @protected
       */
      _isFiltered: function () {
         return this._$filter.length > 0;
      },

      /**
       * Проверяет, что порядок элементов проекции отличается от исходной коллекции
       * @return {Boolean}
       * @protected
       */
      _isSorted: function () {
         if (this._isSortedCache === undefined) {
            if (this._sortMap.length === this._getItemsStrategy().getCount()) {
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
       * @return {Boolean}
       * @protected
       */
      _isUserSorted: function () {
         return this._$sort.length > 0;
      },

      /**
       * Проверяет, что используется группировка
       * @return {Boolean}
       * @protected
       */
      _isGrouped: function () {
         return !!this._$group;
      },

      /**
       * Возвращает индекс группы по ее идентификатору
       * @param {String} groupId Идентификатор группы
       * @return {Number}
       * @protected
       */
      _getGroupIndexById: function (groupId) {
         return this._groups.indexOf(groupId);
      },

      /**
       * Возвращает идентификатор группы по ее индексу
       * @param {Number} groupIndex Индекс группы
       * @return {String}
       * @protected
       */
      _getGroupIdByIndex: function (groupIndex) {
         return this._groups && this._groups[groupIndex];
      },

      /**
       * Возвращает индекс группы элемента
       * @param {Number} index Индекс элемента в проекции
       * @return {Number}
       * @protected
       */
      _getGroupIndexByIndex: function (index) {
         var collectionIndex = this._getUtilityEnumerator().getSourceByInternal(index),
            groupIndex = this._groupMap[collectionIndex];

         return groupIndex === undefined ? -1 : groupIndex;
      },

      /**
       * Дробавляет срез элементов в индексы
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} items Элементы
       * @protected
       */
      _addItems: function (start, items) {
         var isFiltered = this._isFiltered(),
            splice = Array.prototype.splice,
            strategy = this._getItemsStrategy(),
            filterMap = [],
            sortMap = [],
            groupMap = [];

         items.forEach(function(item, index) {
            filterMap.push(!isFiltered);
            sortMap.push(start + index);
            groupMap.push(undefined);
         });

         strategy.splice(start, 0, items);
         splice.apply(this._filterMap, [start, 0].concat(filterMap));
         splice.apply(this._sortMap, [start, 0].concat(sortMap));
         if (this._isGrouped()) {
            splice.apply(this._groupMap, [start, 0].concat(groupMap));
         }
      },

      /**
       * Удаляет срез элементов из индексов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} [count] Кол-во элементов
       * @return {Array.<WS.Data/Display/CollectionItem>}
       * @protected
       */
      _removeItems: function (start, count) {
         start = start || 0;
         count = count === undefined ? this._getItemsStrategy().getCount() - start : count;

         var strategy = this._getItemsStrategy(),
            result;

         result = strategy.splice(start, count);
         this._filterMap.splice(start, count);
         this._removeFromSortMap(start, count);
         if (this._isGrouped()) {
            this._groupMap.splice(start, count);
         }

         return result;
      },

      _moveItems: function (items, newIndex, oldIndex) {
         var length = items.length,
            strategy = this._getItemsStrategy(),
            currentItems;

         currentItems = strategy.splice(oldIndex, length);
         strategy.splice(newIndex, 0, currentItems);
      },

      /**
       * Удаляет из индекса сортировки срез элементов
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Number} count Кол-во элементов
       * @return {Array.<Number>}
       * @protected
       */
      _removeFromSortMap: function (start, count) {
         start = start || 0;
         count = count || 0;
         var finish = start + count,
            index,
            sortIndex,
            toRemove = [],
            removed = {};

         //Collect indices to remove
         for (index = start; index < finish; index++) {
            sortIndex = this._sortMap.indexOf(index);
            if (sortIndex > -1) {
               toRemove.push(sortIndex);
               removed[sortIndex] = this._sortMap[sortIndex];
            }
         }

         //Remove collected indices from _sortMap
         toRemove.sort(function (a, b) {
            return a - b;
         });
         for (index = toRemove.length - 1; index >= 0; index--) {
            this._sortMap.splice(toRemove[index], 1);
         }

         //Shift _sortMap values by count from start index
         for (index = 0; index < this._sortMap.length; index++) {
            if (this._sortMap[index] >= start) {
               this._sortMap[index] -= count;
            }
         }

         this._reIndex();

         return removed;
      },

      /**
       * Заменяет элементы в индексах
       * @param {Number} start Начальный индекс (в исходной коллекци)
       * @param {Array} newItems Новые элементы
       * @return {Array} Замененные элементы
       * @protected
       */
      _replaceItems: function (start, newItems) {
         var items = this._getItems(),
            replaced = [],
            item;
         for (var i = 0, count = newItems.length; i < count; i++) {
            item = items[start + i];
            if (item) {
               replaced.push(item.getContents());
               item.setContents(newItems[i], true);
            } else {
               Utils.logger.log('WS.Data/Display/Collection::_replaceItems(): item for replace does not exist');
            }
         }
         return replaced;
      },

      /**
       * Генерирует событие об изменении текущего элемента проекции коллекции
       * @param {WS.Data/Display/CollectionItem} newCurrent Новый текущий элемент
       * @param {WS.Data/Display/CollectionItem} oldCurrent Старый текущий элемент
       * @param {Number} newPosition Новая позиция
       * @param {Number} oldPosition Старая позиция
       * @protected
       */
      _notifyCurrentChange: function (newCurrent, oldCurrent, newPosition, oldPosition) {
         if (!this.isEventRaising()) {
            return;
         }

         this._removeFromQueue('onCurrentChange');
         this._notify(
            'onCurrentChange',
            newCurrent,
            oldCurrent,
            newPosition,
            oldPosition
         );
      },

      /**
       * Генерирует событие о начале изменений коллекции
       * @protected
       */
      _notifyBeforeCollectionChange: function () {
         if (!this.isEventRaising()) {
            return;
         }
         this._notify('onBeforeCollectionChange');
      },

      /**
       * Генерирует событие об окончании изменений коллекции
       * @protected
       */
      _notifyAfterCollectionChange: function () {
         if (!this.isEventRaising()) {
            return;
         }
         this._notify('onAfterCollectionChange');
      }

      //endregion Changing

      //endregion Protected methods

   });

   var _private = {
      MESSAGE_READ_ONLY: 'The Display is read only. You should modify the source collection instead.',

      sorters: {
         /**
          * Создает индекс сортировки в порядке, определенном набором пользовательских обработчиков
          * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции.
          * @param {Array.<Number>} current Текущий индекс сортировки
          * @param {Object} options Пользовательские обработчики для Array.prototype.sort
          * @private
          */
         user: function(items, current, options) {
            var map = [],
               sorted = [],
               handlers = options.userSort;

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
         },
         
         /**
          * Создает индекс сортировки в порядке группировки
          * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции.
          * @param {Array.<Number>} currentMap Текущий индекс сортировки
          * @param {Object} options Опции
          * @return {Array.<Number>}
          * @private
          */
         group: function (items, currentMap, options) {
            var groupMap = options.groupMap,
               map;

            map = CollectionHelpers.map(currentMap, function(item, index) {
               return [item, index];
            }).sort(function (a, b) {
               return groupMap[a[0]] - groupMap[b[0]] || a[1] - b[1];
            });

            return CollectionHelpers.map(map, function(item) {
               return item[0];
            });
         }
      },

      /**
       * Обрабатывает событие об изменении исходной коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array.<*>} newItems Новые элементы коллекции.
       * @param {Number} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {Array.<*>} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      onSourceCollectionChange: function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (action === IBindCollectionDisplay.ACTION_RESET) {
            oldItems = this._getItems().slice();
            this._reBuild(true);
            newItems = this._getItems().slice();
            this._notifyBeforeCollectionChange();
            this._notifyCollectionChange(
               action,
               newItems,
               newItemsIndex,
               oldItems,
               oldItemsIndex
            );
            this._notifyAfterCollectionChange();
            return;
         }

         newItemsIndex = this._getItemIndex(newItemsIndex);
         oldItemsIndex = this._getItemIndex(oldItemsIndex);

         var session = this._startUpdateSession();

         switch (action) {
            case IBindCollectionDisplay.ACTION_ADD:
               this._addItems(newItemsIndex, newItems);
               if (this._isGrouped()) {
                  this._reGroup(newItemsIndex, newItems.length);
               }
               this._reSort();
               if (this._isFiltered()) {
                  this._reFilter(newItemsIndex, newItems.length);
               }
               break;

            case IBindCollectionDisplay.ACTION_REMOVE:
               this._removeItems(oldItemsIndex, oldItems.length);
               this._reSort();
               break;

            case IBindCollectionDisplay.ACTION_REPLACE:
               //FIXME: detect that items replaced with itself
               var isEqual = CollectionHelpers.reduce(newItems, function(prev, item, index) {
                  return prev && item === oldItems[index];
               }, true);
               if (isEqual) {
                  this._notifyBeforeCollectionChange();
                  this._notifyCollectionChange(
                     action,
                     this._getItems().slice(newItemsIndex, newItemsIndex + newItems.length),
                     newItemsIndex,
                     this._getItems().slice(oldItemsIndex, oldItemsIndex + oldItems.length),
                     oldItemsIndex
                  );
                  this._notifyAfterCollectionChange();
                  return;
               }

               this._replaceItems(newItemsIndex, newItems);
               if (this._isGrouped()) {
                  this._reGroup(newItemsIndex, newItems.length);
               }
               this._reSort();
               if (this._isFiltered()) {
                  this._reFilter(newItemsIndex, newItems.length);
               }
               break;

            case IBindCollectionDisplay.ACTION_MOVE:
               this._moveItems(newItems, newItemsIndex, oldItemsIndex);
               this._reSort();
               if (this._isFiltered()) {
                  this._reFilter();
               }
               break;
         }

         this._finishUpdateSession(session);
      },

      /**
       * Обрабатывает событие об изменении элемента исходной коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {*} item Измененный элемент коллекции.
       * @param {Number} index Индекс измененного элемента.
       * @param {Object.<String, *>} [properties] Изменившиеся свойства
       * @private
       */
      onSourceCollectionItemChange: function (event, item, index, properties) {
         if (!this.isEventRaising()) {
            return;
         }

         if (this._sourceCollectionSynchronized) {
            this._notifyBeforeCollectionChange();
            _private.notifySourceCollectionItemChange.call(this, event, item, index, properties);
            this._notifyAfterCollectionChange();
         } else {
            this._sourceCollectionDelayedCallbacks = this._sourceCollectionDelayedCallbacks || [];
            this._sourceCollectionDelayedCallbacks.push([_private.notifySourceCollectionItemChange, arguments]);
         }
      },

      /**
       * Генерирует событие об изменении элемента проекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {*} item Измененный элемент исходной коллекции.
       * @param {Number} index Индекс измененного элемента.
       * @param {Object.<String, *>} [properties] Изменившиеся свойства
       * @private
       */
      notifySourceCollectionItemChange: function (event, item, index, properties) {
         //Only changes of important properties can launch analysis
         for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
               if (this._$importantItemProperties.indexOf(key) > -1) {
                  this._reAnalize(index, 1);
                  break;
               }
            }
         }

         if (!this.isEventRaising()) {
            return;
         }

         var internalIndex = this._getUtilityEnumerator().getInternalBySource(index);
         if (internalIndex > -1) {
            this._notify(
               'onCollectionItemChange',
               this._getItems()[index],
               internalIndex,
               {contents: item, 'contents.properties': properties}
            );
         }
      },

      /**
       * Обрабатывает событие об изменении элемента исходной коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Boolean} enabled Включена или выключена генерация событий
       * @param {Boolean} analyze Включен или выключен анализ изменений
       * @private
       */
      onSourceCollectionEventRaisingChange: function (event, enabled, analyze) {
         //Если без выключили без анализа изменений, то при следующем включении генерации надо актуализировать состояние
         if (!analyze && enabled) {
            this._reBuild(true);
         }

         this._sourceCollectionSynchronized = enabled;

         //Call delayed handlers if get back to synchronize
         var callbacks = this._sourceCollectionDelayedCallbacks,
            callback;
         if (this._sourceCollectionSynchronized && callbacks) {
            while (callbacks.length > 0) {
               this._notifyBeforeCollectionChange();
               callback = callbacks[0];
               callback[0].apply(this, callback[1]);
               callbacks.shift();
               this._notifyAfterCollectionChange();
            }
         }
      }
   };

   //Deprecated methods
   Collection.prototype.getByHash = Collection.prototype.getByInstanceId;
   Collection.prototype.getIndexByHash = Collection.prototype.getIndexByInstanceId;

   Di.register('display.collection', Collection);

   return Collection;
});
