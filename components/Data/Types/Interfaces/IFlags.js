/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IFlags', [], function () {
   'use strict';

   /**
    * Интерфейс флагов
    * @mixin SBIS3.CONTROLS.Data.Types.IFlags
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends SBIS3.CONTROLS.Data.Data.Types.IFlags.prototype */{
      /**
       * Возвращает значение флага по названию
       * @param name {String} Название флага
       * @returns {Boolean|Null}
       */
      get: function (name) {
         throw new Error('Method must be implemented');
      },
      /**
       * Устанавливает значение флага по названию
       * @param name {String} Название флага
       * @param value {Boolean|Null} Значение
       */
      set: function (name, value) {
         throw new Error('Method must be implemented');
      },
      /**
       * Сравнивает с флагами
       * @param obj {IFlags} - Объект реализущий интерфейс IFlags
       * returns {Boolean}
       */
      equals: function(obj) {
         throw new Error('Method must be implemented');
      },
      /**
       * Возвращает значение флага по индексу
       * @param index {Number} Индекс флага
       * returns {Boolean|Null}
       */
      getByIndex: function(index) {
         throw new Error('Method must be implemented');
      },
      /**
       * Устанавливает значение флага по индексу
       * @param index {Number} - индекс флага
       * @param value {Boolean|Null} - значение флага
       */
      setByIndex: function(index, value) {
         throw new Error('Method must be implemented');
      },
      /**
       * Установить всем флагам false
       */
      setFalseAll: function() {
         throw new Error('Method must be implemented');
      },
      /**
       * Установить всем флагам true
       */
      setTrueAll: function() {
         throw new Error('Method must be implemented');
      },
      /**
       * Установить всем флагам null
       */
      setNullAll: function() {
         throw new Error('Method must be implemented');
      }
   };
});
