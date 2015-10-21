/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.List', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.IList',
   'js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.CollectionItem'
], function (IEnumerable, IList, IIndexedCollection, ArrayEnumerator) {
   'use strict';

   /**
    * Список - коллекция c доступом по порядковому индексу
    * @class SBIS3.CONTROLS.Data.Collection.List
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Collection.IList
    * @mixes SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @public
    * @author Мальцев Алексей
    */

   var List = $ws.proto.Abstract.extend([IEnumerable, IList, IIndexedCollection], /** @lends SBIS3.CONTROLS.Data.Collection.List.prototype */{
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
          * @var {String} Модуль элемента дерева
          */
         _itemModule: 'SBIS3.CONTROLS.Data.Collection.CollectionItem',

         /**
          * @var {Boolean} Отдавать оригинальные элементы в методах на чтение
          */
         _unwrapOnRead: true,

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
            for (var i = 0, count = cfg.items.length; i < count; i++) {
               this._items[i] = this._convertToItem(cfg.items[i]);
            }
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора элементов коллеции
       * @param {Boolean} [unwrap] Отдавать оригинальные элементы
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function (unwrap) {
         if (unwrap === undefined) {
            unwrap = this._unwrapOnRead;
         }
         return new ArrayEnumerator({
            items: this._items,
            unwrapModule: unwrap ? this._itemModule : ''
         });
      },

      each: function (callback, context) {
         //так быстрее, чем по правильному - через enumerator
         for (var i = 0, count = this._items.length; i < count; i++) {
            callback.call(
               context || this,
               this._unwrapOnRead ? this._items[i].getContents() : this._items[i],
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

         for (var i = 0, count = items.length; i < count; i++) {
            items[i] = this._convertToItem(items[i]);
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
            var listInstead = instead.toArray();
            for (var i = 0, count = listInstead.length; i < count; i++) {
               listInstead[i] = this._convertToItem(listInstead[i]);
            }

            Array.prototype.splice.apply(this._items, [0, 0].concat(listInstead));
         }

         this._getServiceEnumerator().reIndex();
      },

      add: function (item, at) {
         item = this._convertToItem(item);

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
         return this._unwrapOnRead ?
            (this._isValidIndex(index) ? this._items[index].getContents() : undefined) :
            this._items[index];
      },

      remove: function (item) {
         this.removeAt(this.getIndex(item));
      },

      removeAt: function (index) {
         if (!this._isValidIndex(index)) {
            throw new Error('Index is out of bounds');
         }
         this._items[index].setOwner(undefined);
         this._items.splice(index, 1);

         this._getServiceEnumerator().reIndex();
      },

      replace: function (item, at) {
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }
         this._items[at] = this._convertToItem(item);

         this._getServiceEnumerator().reIndex();
      },

      getIndex: function (item) {
         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IHashable')) {
            return this.getItemIndexByHash(item.getHash());
         }

         if ($ws.helpers.instanceOfModule(item, this._itemModule)) {
            return Array.indexOf(this._items, item);
         }

         //TODO: search by index
         var enumerator = this.getEnumerator(),
            index = 0,
            listItem;
         while ((listItem = enumerator.getNext())) {
            if (this._unwrapOnRead) {
               if (listItem === item) {
                  return index;
               }
            } else {
               if (listItem.getContents() === item) {
                  return index;
               }
            }
            index++;
         }

         return -1;
      },

      getCount: function () {
         return this._items.length;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region SBIS3.CONTROLS.Data.Collection.IIndexedCollection

      getItemByHash: function (hash) {
         return this._getServiceEnumerator().getItemByPropertyValue('hash', hash);
      },

      getItemIndexByHash: function (hash) {
         return this._getServiceEnumerator().getItemIndexByPropertyValue('hash', hash);
      },

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
       * Превращает объект в элемент дерева
       * @param {*} item Объект
       * @returns {SBIS3.CONTROLS.Data.Tree.TreeItem}
       * @private
       */
      _convertToItem: function (item) {
         if ($ws.helpers.instanceOfModule(item, this._itemModule)) {
            item.setOwner(this);
            return item;
         }

         return $ws.single.ioc.resolve(this._itemModule, {
            owner: this,
            contents: item
         });
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
