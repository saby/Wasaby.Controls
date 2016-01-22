/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.List', [
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.IList',
   'js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.ContextField'
], function (SerializableMixin, IEnumerable, IList, IIndexedCollection, ArrayEnumerator, ContextField) {
   'use strict';

   /**
    * Список - коллекция c доступом по порядковому индексу
    * @class SBIS3.CONTROLS.Data.Collection.List
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Collection.IList
    * @mixes SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @public
    * @author Мальцев Алексей
    */

   var List = $ws.proto.Abstract.extend([SerializableMixin, IEnumerable, IList, IIndexedCollection], /** @lends SBIS3.CONTROLS.Data.Collection.List.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.List',
      $protected: {
         _options: {
            /**
             * @cfg {Array} Элементы списка
             * @name SBIS3.CONTROLS.Data.Collection.List#items
             */
         },

         /**
          * @var {*[]} Элементы списка
          */
         _items: [],

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator} Служебный энумератор
          */
         _serviceEnumerator: undefined,
         /**
          * @var {SBIS3.CONTROLS.Data.Collection._hashIndex} Индекс хешей элементов
          */
         _hashIndex: undefined

      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         if ('items' in cfg) {
            if (!(cfg.items instanceof Array)) {
               throw new Error('Invalid argument');
            }
            this._items = cfg.items;
         }
      },

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function() {
         return $ws.core.merge(
            List.superclass._getSerializableState.call(this), {
               _items: this._items
            }
         );
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state).callNext(function() {
            this._items = state._items;
         });
      },

      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов коллеции
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator({
            items: this._items
         });
      },

      /**
       * Итератор для обхода всех элементов коллекции
       * Цикл проходит полное количество итераций, его невозможно прервать досрочно
       * @param callback
       * @param context
       */
      each: function (callback, context) {
         //так быстрее, чем по правильному - через enumerator
         for (var i = 0, count = this._items.length; i < count; i++) {
            callback.call(
               context || this,
               this._items[i],
               i
            );
         }
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      assign: function (items) {
         this._items.length = 0;
         this._splice(items || [], 0, 0);
      },

      append: function (items) {
         this._splice(items, this.getCount(), 0);
      },

      prepend: function (items) {
         this._splice(items, 0, 0);
      },

      clear: function () {
         this._items.length = 0;
         this._reindex();
      },

      add: function (item, at) {
         if (at === undefined) {
            this._items.push(item);
         } else {
            at = at || 0;
            if (at !== 0 && !this._isValidIndex(at)) {
               throw new Error('Index is out of bounds');
            }
            this._items.splice(at, 0, item);
         }

         this._reindex();
      },

      at: function (index) {
         return this._items[index];
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
         this._items.splice(index, 1);

         this._reindex();
      },

      replace: function (item, at) {
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }
         this._items[at] = item;

         this._reindex();
      },

      getIndex: function (item) {
         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
            return this.getIndexByValue('hash', item.getHash());
         }

         return Array.indexOf(this._items, item);
      },

      getCount: function () {
         return this._items.length;
      },

      equals: function (another) {
         if (!another ||
            typeof another !== 'object' ||
            !$ws.helpers.instanceOfMixin(another, 'SBIS3.CONTROLS.Data.Collection.IList')
         ) {
            return false;
         }

         if (this._items.length !== another.getCount()) {
            return false;
         }
         for (var i = 0, count = this._items.length; i < count; i++) {
            if (this._items[i] !== another.at(i)) {
               return false;
            }
         }
         return true;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      getIndexByValue: function (property, value) {
         return this._getServiceEnumerator().getIndexByValue(property, value);
      },

      getIndiciesByValue: function (property, value) {
         return this._getServiceEnumerator().getIndiciesByValue(property, value);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      /**
       * Присоединяет другую коллекцию
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable} items Коллекция, которая будет присоединена
       * @param {Boolean} [prepend=false] Присоединить в начало
       * @deprecated используйте append или prepend
       */
      concat: function (items, prepend) {
         var isArray = items instanceof Array;
         if (!isArray && !$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new Error('Invalid argument');
         }
         if (!isArray) {
            items = items.toArray();
         }

         if (prepend) {
            Array.prototype.splice.apply(this._items, [0, 0].concat(items));
         } else {
            Array.prototype.splice.apply(this._items, [this._items.length, 0].concat(items));
         }

         this._reindex();
      },
      /**
       * Возвращает коллекцию в виде массива
       * @deprecated используйте each
       * @returns {Array}
       */
      toArray: function () {
         return this._items.slice();
      },

      //region Protected methods

      /**
       * Возвращает Служебный энумератор
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      _getServiceEnumerator: function () {
         return this._serviceEnumerator || (this._serviceEnumerator = new ArrayEnumerator({
            items: this._items
         }));
      },

      /**
       * Проверяет корректность индекса
       * @param {Number} index Индекс
       * @returns {Boolean}
       * @private
       */
      _isValidIndex: function (index) {
         return index >= 0 && index < this.getCount();
      },

      _getItemIndexByHash: function (hash) {
         if (typeof this._hashIndex === 'undefined') {
            this._createHashIndex();
         }
         return this._hashIndex.hasOwnProperty(hash) ? this._hashIndex[hash] : -1;
      },

      _createHashIndex: function () {
         var self = this;
         self._hashIndex = {};
         this.each(function (item, position) {
            if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
               self._hashIndex[item.getHash()] = position;
            }
         });
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
         var addItems = [];
         if(items instanceof Array) {
            addItems = items;
         } else if(items && $ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            var self = this;
            items.each(function (item){
               addItems.push(item);
            });
         } else {
            throw new Error('Invalid argument');
         }
         Array.prototype.splice.apply(this._items,([start, 0].concat(addItems)));

         this._getServiceEnumerator().reIndex();
      }
      //endregion Protected methods

   });

   //Регистрируем класс ObservableList для работы с контекстами $ws.proto.Context
   //в новой версии ядра нужно будет сделать, чтобы привязыки данных к этим типам работали "из коробки"
   ContextField.registerDataSet('ControlsFieldTypeList', List, 'onCollectionItemChange');

   return List;
});
