/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin'
], function (IEnumerator, IndexedEnumeratorMixin) {
   'use strict';

   /**
    * Энумератор для массива
    * @class SBIS3.CONTROLS.Data.Collection.ArrayEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend([IEnumerator, IndexedEnumeratorMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ArrayEnumerator.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
      /**
       * @member {Array} Массив
       */
      _items: null,

      /**
       * @member {Number} Текущий индекс
       */
      _index: -1,

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

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      getCurrent: function () {
         if (this._index < 0) {
            return undefined;
         }
         return this._items[this._index];
      },

      getNext: function () {
         if (1 + this._index >= this._items.length) {
            return undefined;
         }
         this._index++;
         return this.getCurrent();
      },

      reset: function () {
         this._index = -1;
      }

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

   });
});
