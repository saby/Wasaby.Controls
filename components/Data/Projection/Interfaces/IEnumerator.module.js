/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.IEnumerator', [
], function () {
   'use strict';

   /**
    * Интерфейс энумератора проекции
    * @mixin SBIS3.CONTROLS.Data.Projection.IEnumerator
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Projection.IEnumerator.prototype */{
      /**
       * Возвращает элемент по индексу
       * @param {Number} index Индекс
       * @returns {SBIS3.CONTROLS.Data.Projection.ICollectionItem}
       * @state mutable
       */
      at: function (index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} item Текущий элемент
       */
      setCurrent: function(item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает текущую позицию в проекции
       * @returns {Number}
       */
      getPosition: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущую позицию
       * @param {Number} internal Позиция в проекции
       * @returns {Boolean}
       */
      setPosition: function(internal) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает предыдущий элемент
       * @returns {*}
       */
      getPrevious: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Вычисляет позицию в проекции относительно позиции в исходной коллекции
       * @param {Number} source Позиция в исходной коллекции
       * @returns {Number}
       */
      getInternalBySource: function (source) {
         throw new Error('Method must be implemented');
      }
   };
});
