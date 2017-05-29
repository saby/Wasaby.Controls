/* global define */
define('js!WS.Data/Collection/ObjectEnumerator', [
   'js!WS.Data/Collection/IEnumerator',
   'js!WS.Data/Utils',
   'Core/core-extend'
], function (
   IEnumerator,
   Utils,
   CoreExtend
) {
   'use strict';

   /**
    * Энумератор для собственных свойств объекта
    * @class WS.Data/Collection/ObjectEnumerator
    * @implements WS.Data/Collection/IEnumerator
    * @public
    * @author Мальцев Алексей
    */

   return CoreExtend.extend([IEnumerator], /** @lends WS.Data/Collection/ObjectEnumerator.prototype */{
      _moduleName: 'WS.Data/Collection/ObjectEnumerator',

      /**
       * @member {Object} Объект
       */
      _items: null,

      /**
       * @member {Array} Набор свойств объекта
       */
      _keys: null,

      /**
       * @member {Number} Текущий индекс
       */
      _index: -1,

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
            items = {};
         }
         if (!(items instanceof Object)) {
            throw new Error('Argument items should be an instance of Object');
         }
         this._items = items;
         this._keys = Object.keys(items);
      },

      //region WS.Data/Collection/IEnumerator

      getCurrent: function () {
         if (this._index < 0) {
            return undefined;
         }
         return this._items[this._keys[this._index]];
      },

      moveNext: function () {
         if (1 + this._index >= this._keys.length) {
            return false;
         }
         this._index++;

         var current = this.getCurrent();
         if (this._filter && !this._filter(current, this.getCurrentIndex())) {
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
         return this._keys[this._index];
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
