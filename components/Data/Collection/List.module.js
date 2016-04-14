/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.List', [
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.IList',
   'js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection',
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.Entity.ObservableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Serializer',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.ContextField.List'
], function (SerializableMixin, IEnumerable, IList, IIndexedCollection, Abstract, OptionsMixin, ObservableMixin, ArrayEnumerator, Serializer, Di, Utils, ContextFieldList) {
   'use strict';

   /**
    * Список - коллекция c доступом по порядковому индексу
    * @class SBIS3.CONTROLS.Data.Collection.List
    * @extends SBIS3.CONTROLS.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.Entity.ObservableMixin
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Collection.IList
    * @mixes SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @public
    * @author Мальцев Алексей
    */

   var List = Abstract.extend([OptionsMixin, ObservableMixin, SerializableMixin, IEnumerable, IList, IIndexedCollection], /** @lends SBIS3.CONTROLS.Data.Collection.List.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.List',

      /**
       * @cfg {Array.<*>} Элементы списка
       * @name SBIS3.CONTROLS.Data.Collection.List#items
       */
      $items: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator} Служебный энумератор
       */
      _serviceEnumerator: undefined,

      /**
       * @member {SBIS3.CONTROLS.Data.Collection._hashIndex} Индекс хешей элементов
       */
      _hashIndex: undefined,

      constructor: function $List(options) {
         this.$items = this.$items || [];

         options = options || {};
         if ('items' in options) {
            if (!(options.items instanceof Array)) {
               throw new TypeError('Option "items" should be an instance of Array');
            }
         }

         List.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function(state) {
         return SerializableMixin._getSerializableState.call(this, state);
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            this._clearServiceEnumerator();
         });
      },

      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов коллеции
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this.$items);
      },

      /**
       * Итератор для обхода всех элементов коллекции
       * Цикл проходит полное количество итераций, его невозможно прервать досрочно
       * @param callback
       * @param context
       */
      each: function (callback, context) {
         //так быстрее, чем по правильному - через enumerator
         for (var i = 0, count = this.$items.length; i < count; i++) {
            callback.call(
               context || this,
               this.$items[i],
               i
            );
         }
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      assign: function (items) {
         this.$items.length = 0;
         this._splice(items || [], 0, 0);
         this._reindex();
      },

      append: function (items) {
         this._splice(items, this.getCount(), 0);
         this._reindex();
      },

      prepend: function (items) {
         this._splice(items, 0, 0);
         this._reindex();
      },

      clear: function () {
         this.$items.length = 0;
         this._reindex();
      },

      add: function (item, at) {
         if (at === undefined) {
            this.$items.push(item);
         } else {
            at = at || 0;
            if (at !== 0 && !this._isValidIndex(at, true)) {
               throw new Error('Index is out of bounds');
            }
            this.$items.splice(at, 0, item);
         }

         this._reindex();
      },

      at: function (index) {
         return this.$items[index];
      },

      remove: function (item) {
         var index = this.getIndex(item);
         if(index !== -1) {
            this.removeAt(index);
            return true;
         }
         return false;
      },

      removeAt: function (index) {
         if (!this._isValidIndex(index)) {
            throw new Error('Index is out of bounds');
         }
         this.$items.splice(index, 1);

         this._reindex();
      },

      replace: function (item, at) {
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }
         this.$items[at] = item;

         this._reindex();
      },

      getIndex: function (item) {
         if (item && $ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
            return this._getItemIndexByHash(item.getHash());
         }

         return Array.indexOf(this.$items, item);
      },

      getCount: function () {
         return this.$items.length;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      getIndexByValue: function (property, value) {
         return this._getServiceEnumerator().getIndexByValue(property, value);
      },

      getIndicesByValue: function (property, value) {
         return this._getServiceEnumerator().getIndicesByValue(property, value);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      //region deprecated

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @deprecated метод будет удален в 3.7.4 используйте getIndicesByValue()
       * @returns {Array.<Number>}
       */
      getIndiciesByValue: function (property, value) {
         Utils.logger.stack(this._moduleName + '::getIndiciesByValue(): method is deprecated and will be removed in 3.7.4. Use getIndicesByValue() instead.');
         return this.getIndicesByValue(property, value);
      },

      /**
       * Присоединяет другую коллекцию
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable} items Коллекция, которая будет присоединена
       * @param {Boolean} [prepend=false] Присоединить в начало
       * @deprecated метод будет удален в 3.7.4 используйте append() или prepend()
       */
      concat: function (items, prepend) {
         Utils.logger.stack(this._moduleName + '::concat(): method is deprecated and will be removed in 3.7.4. Use append() or prepend() instead.');
         if (prepend) {
            this.prepend(items);
         } else {
            this.append(items);
         }
      },

      /**
       * Возвращает коллекцию в виде массива
       * @returns {Array}
       * @deprecated метод не рекомендуется к использованию, используйте each()
       */
      toArray: function () {
         return this.$items.slice();
      },

      //endregion deprecated

      //region Public methods

      /**
       * Клонирует список
       * @returns {SBIS3.CONTROLS.Data.Collection.List}
       */
      clone: function () {
         var serializer = new Serializer();
         return JSON.parse(
            JSON.stringify(this, serializer.serialize),
            serializer.deserialize
         );
      },

      equals: function (another) {
         Utils.logger.stack(this._moduleName + '::equals(): method is deprecated and will be removed in 3.7.4. Use isEqual() instead.');
         return this.isEqual(another);
      },

      /**
       * Проверяет эквивалентность элементов другого списка (должно совпадать количество элементов и сами элементы (строгое сравнение))
       * @param {SBIS3.CONTROLS.Data.Collection.List} list Список, эквивалентность которого проверяется
       * @returns {Boolean}
       */
      isEqual: function (list) {
         if (list === this) {
            return true;
         }
         if (!list ||
            !$ws.helpers.instanceOfModule(list, 'SBIS3.CONTROLS.Data.Collection.List')
         ) {
            return false;
         }

         if (this.getCount() !== list.getCount()) {
            return false;
         }
         for (var i = 0, count = this.getCount(); i < count; i++) {
            if (this.at(i) !== list.at(i)) {
               return false;
            }
         }
         return true;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает Служебный энумератор
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      _getServiceEnumerator: function () {
         return this._serviceEnumerator || (this._serviceEnumerator = new ArrayEnumerator(this.$items));
      },

      _clearServiceEnumerator: function () {
          this._serviceEnumerator = undefined;
      },
      /**
       * Проверяет корректность индекса
       * @param {Number} index Индекс
       * @param {Boolean} [addMode=false] Режим добавления
       * @returns {Boolean}
       * @private
       */
      _isValidIndex: function (index, addMode) {
         var max = this.getCount();
         if (addMode) {
            max++;
         }
         return index >= 0 && index < max;
      },

      _getItemIndexByHash: function (hash) {
         if (this._hashIndex === undefined) {
            this._createHashIndex();
         }
         return this._hashIndex.hasOwnProperty(hash) ? this._hashIndex[hash] : -1;
      },

      _createHashIndex: function () {
         this._hashIndex = {};
         for (var i = 0, count = this.$items.length; i < count; i++) {
            var item = this.$items[i];
            if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
               this._hashIndex[item.getHash()] = i;
            }
         }

      },

      _reindex: function () {
         this._hashIndex = undefined;
         this._getServiceEnumerator().reIndex();
      },

      /**
       * Вызывает метод splice
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} items Коллекция с элементами для замены
       * @param {Number} start Индекс в массиве, с которого начинать добавление.
       * @private
       */
      _splice: function (items, start){
         Array.prototype.splice.apply(this.$items,([start, 0].concat(
            this._itemsToArray(items)
         )));
         this._getServiceEnumerator().reIndex();
      },
      /**
       * Приводит переденные элементы к массиву
       * @param items
       * @returns {Array}
       * @private
       */
      _itemsToArray: function (items){
         if(items instanceof Array) {
            return items;
         } else if(items && $ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            var result = [];
            items.each(function (item) {
               result.push(item);
            });
            return result;
         } else {
            throw new TypeError('Argument "items" must be an instance of Array or implement SBIS3.CONTROLS.Data.Collection.IEnumerable.');
         }
      }
      //endregion Protected methods

   });

   Di.register('collection.list', List);

   $ws.proto.Context.registerFieldType(new ContextFieldList({module: List}));

   return List;
});
