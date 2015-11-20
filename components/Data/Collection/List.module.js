/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.List', [
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.IList',
   'js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (SerializableMixin, IEnumerable, IList, IIndexedCollection, ArrayEnumerator) {
   'use strict';

   /**
    * Список - коллекция c доступом по порядковому индексу
    * @class SBIS3.CONTROLS.Data.Collection.List
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Collection.IList
    * @public
    * @author Мальцев Алексей
    */
   //mixes SBIS3.CONTROLS.Data.Collection.IIndexedCollection - временно отключаем упоминание об этом интерфейсе, возможно его не будет в этом виде

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
          * @var {SBIS3.CONTROLS.Data.Collection.CollectionItem[]} Элементы списка
          */
         _items: [],

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator} Служебный энумератор
          */
         _serviceEnumerator: undefined
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

         this._getServiceEnumerator().reIndex();
      },

      toArray: function () {
         return this._items;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      fill: function (instead) {
         this._items.length = 0;

         if (instead) {
            var isArray = instead instanceof Array;
            if (!isArray && !$ws.helpers.instanceOfMixin(instead, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
               throw new Error('Invalid argument');
            }
            Array.prototype.splice.apply(this._items, [0, 0].concat(instead.toArray()));
         }

         this._getServiceEnumerator().reIndex();
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

         this._getServiceEnumerator().reIndex();
      },

      at: function (index) {
         return this._items[index];
      },

      remove: function (item) {
         this.removeAt(this.getIndex(item));
      },

      removeAt: function (index) {
         if (!this._isValidIndex(index)) {
            throw new Error('Index is out of bounds');
         }
         this._items.splice(index, 1);

         this._getServiceEnumerator().reIndex();
      },

      replace: function (item, at) {
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }
         this._items[at] = item;

         this._getServiceEnumerator().reIndex();
      },

      getIndex: function (item) {
         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
            return this.getItemIndexByPropertyValue('hash', item.getHash());
         }

         return Array.indexOf(this._items, item);
      },

      getCount: function () {
         return this._items.length;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      // Attention! Не используйте методы интерфейса SBIS3.CONTROLS.Data.Collection.IIndexedCollection - он будет изменен.

      getItemByPropertyValue: function (property, value) {
         return this._getServiceEnumerator().getItemByPropertyValue(property, value);
      },

      getItemsByPropertyValue: function (property, value) {
         return this._getServiceEnumerator().getItemsByPropertyValue(property, value);
      },

      getItemIndexByPropertyValue: function (property, value) {
         return this._getServiceEnumerator().getItemIndexByPropertyValue(property, value);
      },

      getItemsIndexByPropertyValue: function (property, value) {
         return this._getServiceEnumerator().getItemsIndexByPropertyValue(property, value);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IIndexedCollection

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
      }

      //endregion Protected methods

   });

   return List;
});
