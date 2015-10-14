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
            contents: undefined,

            /**
             * @cfg {*} Элемент выбран
             */
            selected: false
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
      },

      /**
       * Возвращает признак, что элемент выбран
       * @returns {*}
       */
      isSelected: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает признак, что элемент выбран
       * @param {Boolean} selected Элемент выбран
       */
      setSelected: function (selected) {
         throw new Error('Method must be implemented');
      }
   };
});
