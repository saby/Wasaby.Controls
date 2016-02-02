/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ICollectionItem', [
], function () {
   'use strict';

   /**
    * Интерфейс элемента коллекции
    * @mixin SBIS3.CONTROLS.Data.Projection.ICollectionItem
    * @implements SBIS3.CONTROLS.Data.IHashable
    * @public
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Projection.ICollectionItem.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Коллекция, которой принадлежит элемент
             */
            owner: undefined,

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
       * Возвращает коллекцию, которой принадлежит элемент
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getOwner: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает коллекцию, которой принадлежит элемент
       * @param {SBIS3.CONTROLS.Data.Collection.IList} owner Коллекция, которой принадлежит элемент
       */
      setOwner: function (owner) {
         throw new Error('Method must be implemented');
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
