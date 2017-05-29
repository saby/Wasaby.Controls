/* global define */
define('js!WS.Data/Collection/ArrayEnumerator', [
   'js!WS.Data/Collection/IEnumerator',
   'js!WS.Data/Collection/IndexedEnumeratorMixin',
   'js!WS.Data/Utils',
   'Core/core-extend'
], function (
   IEnumerator,
   IndexedEnumeratorMixin,
   Utils,
   CoreExtend
) {
   'use strict';

   /**
    * Энумератор для массива
    * @class WS.Data/Collection/ArrayEnumerator
    * @implements WS.Data/Collection/IEnumerator
    * @mixes WS.Data/Collection/IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   return CoreExtend.extend([IEnumerator, IndexedEnumeratorMixin], /** @lends WS.Data/Collection/ArrayEnumerator.prototype */{
      _moduleName: 'WS.Data/Collection/ArrayEnumerator',

      /**
       * @member {Array} Массив
       */
      _items: null,

      /**
       * @member {Number} Текущий индекс
       */
      _index: -1,

      /**
       * @member {Function(Number): *} Резолвер элементов
       */
      _resolver: null,

      /**
       * @member {Function(*): Boolean} Фильтр элементов
       */
      _filter: null,

      /**
       * Конструктор
       * @param {Array} items Массив
       */
      constructor: function (items) {
         if (items === undefined) {
            items = [];
         }
         if (!(items instanceof Array)) {
            throw new Error('Argument items should be an instance of Array');
         }
         this._items = items;
         IndexedEnumeratorMixin.constructor.call(this);
      },

      //region WS.Data/Collection/IEnumerator

      getCurrent: function () {
         if (this._index < 0) {
            return undefined;
         }
         return this._resolver ? this._resolver(this._index) : this._items[this._index];
      },

      moveNext: function () {
         if (1 + this._index >= this._items.length) {
            return false;
         }
         this._index++;

         var current = this.getCurrent();
         if (this._filter && !this._filter(current, this._index)) {
            return this.moveNext();
         }

         return true;
      },

      getNext: function () {
         Utils.logger.stack(this._moduleName + '::getNext(): method is deprecated and will be removed in 3.7.6. Use moveNext() + getCurrent() instead.');
         return this.moveNext() ? this.getCurrent() : undefined;
      },

      reset: function () {
         this._index = -1;
      },

      //endregion WS.Data/Collection/IEnumerator

      //region Public methods

      getCurrentIndex: function () {
         return this._index;
      },

      /**
       * Устанавливает резолвер элементов по позиции
       * @param {Function(Number): *} resolver Функция обратного вызова, которая должна по позиции вернуть элемент
       */
      setResolver: function (resolver) {
         this._resolver = resolver;
      },

      /**
       * Устанавливает фильтр элементов
       * @param {Function(*): Boolean} callback Функция обратного вызова, которая должна для каждого элемента вернуть признак, проходит ли он фильтр
       */
      setFilter: function (filter) {
         this._filter = filter;
      }

      //endregion Public methods
   });
});
