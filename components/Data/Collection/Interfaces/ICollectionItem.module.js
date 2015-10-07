/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ICollectionItem', [
], function () {
   'use strict';

   /**
    * Интерфейс элемента коллекции
    * @mixin SBIS3.CONTROLS.Data.Collection.ICollectionItem
    * @implements SBIS3.CONTROLS.Data.IHashable
    * @public
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Collection.ICollectionItem.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {*} Содержимое элемента коллекции
             */
            contents: undefined
         }
      },

      /**
       * Возвращает содержимое элемента коллекции
       * @returns {*}
       */
      getContents: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает содержимое элемента коллекции
       * @param {*} contents Новое содержимое
       */
      setContents: function (contents) {
         throw new Error('Method must be implemented');
      }
   };
});
