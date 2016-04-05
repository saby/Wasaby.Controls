/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.IEnumerator', [
], function () {
   'use strict';

   /**
    * Интерфейс энумератора проекции
    * @mixin SBIS3.CONTROLS.Data.Projection.IEnumerator
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @deprecated интерфейс будет удален в 3.7.4, используйте SBIS3.CONTROLS.Data.Projection.CollectionEnumerator
    * @author Мальцев Алексей
    */

   $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.Projection.IEnumerator', 'Interface is deprecated and will be removed in 3.7.4. Use SBIS3.CONTROLS.Data.Projection.CollectionEnumerator instead.');

   return /** @lends SBIS3.CONTROLS.Data.Projection.IEnumerator.prototype */{
      /**
       * Возвращает элемент по индексу
       * @param {Number} index Индекс
       * @returns {SBIS3.CONTROLS.Data.Projection.CollectionItem}
       * @state mutable
       */
      at: function (index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущий элемент
       * @param {SBIS3.CONTROLS.Data.Projection.CollectionItem} item Текущий элемент
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
