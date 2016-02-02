/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IEnum', [], function () {
   'use strict';

   /**
    * Интерфейс перечисляемого
    * @mixin SBIS3.CONTROLS.Data.Data.Types.IEnum
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends SBIS3.CONTROLS.Data.Data.Types.IEnum.prototype */{
      /**
       * Возвращает текущее значение
       * @returns {Number}
       */
      get: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанаваливает текущее значение
       * @param index {index} Идентификатор записи
       */
      set: function(index) {
         throw new Error('Method must be implemented');
      },
      /**
       * Устанаваливает элемент текущим по значению
       * @param Value {String}
       */
      setByValue: function(Value) {
         throw new Error('Method must be implemented');
      },
      /**
       * Сравнивает с перечисляемым
       * @param obj {IEnum} объект реализующий интерфейс IEnum
       * @returns {Boolean}
       */
      equals: function(obj){
         throw new Error('Method must be implemented');
      }

   };
});
