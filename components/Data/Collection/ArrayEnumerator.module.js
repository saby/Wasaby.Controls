/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin'
], function (IEnumerator, IndexedEnumeratorMixin) {
   'use strict';

   /**
    * Энумератор для списка
    * @class SBIS3.CONTROLS.Data.Collection.ArrayEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend({}, [IEnumerator, IndexedEnumeratorMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ArrayEnumerator.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
      $protected: {
         _options: {
            /**
             * @var {Array} Список
             */
            items: []
         },

         /**
          * @var {Number} Текущий индекс
          */
         _index: -1
      },

      $constructor: function () {
         if (!this._options.items) {
            throw new Error('List is not defined');
         }
         if (!(this._options.items instanceof Array)) {
            throw new Error('List should be instance of an Array');
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      getCurrent: function () {
         if (this._index < 0) {
            return undefined;
         }
         return this._options.items[this._index];
      },

      getNext: function () {
         if (1 + this._index >= this._options.items.length) {
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
