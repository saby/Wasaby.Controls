/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IFlags', [], function () {
   'use strict';

   /**
    * Интерфейс типа флаги.
    * Работает на основе словаря, хранящего соотвествие индексов и их значений.
    * @mixin SBIS3.CONTROLS.Data.Types.IFlags
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends SBIS3.CONTROLS.Data.Types.IFlags.prototype */{
      /**
       * Возвращает состояние флага с именем. Если имя недопустимо, кидает исключение.
       * @param {String} name Название флага
       * @returns {Boolean|Null}
       */
      get: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает состояние флага с именем. Если имя недопустимо, кидает исключение.
       * @param {String} name Название флага
       * @param {Boolean|Null} value Значение флага
       */
      set: function (name, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает состояние флага по индексу. Если индекс недопустим, кидает исключение.
       * @param {Number} index Индекс флага
       * returns {Boolean|Null}
       */
      getByIndex: function(index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает состояние флага по индексу. Если индекс недопустим, кидает исключение.
       * @param {Number} index Индекс флага
       * @param {Boolean|Null} value Значение флага
       */
      setByIndex: function(index, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает все флаги в состояние false
       */
      setFalseAll: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает все флаги в состояние true
       */
      setTrueAll: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает все флаги в состояние null
       */
      setNullAll: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Сопоставляет два Flags по совпадению состояния всех флагов. Также проверяется совпадение словарей.
       * @param {IFlags} to Объект, реализующий интерфейс IFlags
       * @returns {Boolean}
       */
      isEqual: function(to) {
         throw new Error('Method must be implemented');
      }
   };
});
