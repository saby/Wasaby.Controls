/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IEnum', [], function () {
   'use strict';

   /**
    * Интерфейс перечисляемого типа.
    * Работает на основе словаря, хранящего соотвествие индексов и их значений.
    * @mixin SBIS3.CONTROLS.Data.Types.IEnum
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends SBIS3.CONTROLS.Data.Types.IEnum.prototype */{
      /**
       * Возвращает выбранный индекс.
       * @returns {Number|Null}
       */
      get: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает выбранный индекс. Если индекс недопустим, кидает исключение.
       * @param {Number|Null} index Выбранный индекс
       */
      set: function(index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает значение, соответствующее выбранному индексу.
       * @returns {String}
       */
      getAsValue: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает выбранный индекс по соответствующему ему значению. Если значение недопустимо, кидает исключение.
       * @param {String} value Выбранное значение
       */
      setByValue: function(value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Сопоставляет два Enum по совпадению выбранного индекса. Также проверяется совпадение словарей.
       * @param {IEnum} to Объект, реализующий интерфейс IEnum
       * @returns {Boolean}
       */
      isEqual: function(to) {
         throw new Error('Method must be implemented');
      }
   };
});
