/* global define */
define('js!WS.Data/Types/IEnum', [], function () {
   'use strict';

   /**
    * Интерфейс перечисляемого типа.
    * Работает на основе словаря, хранящего соотвествие индексов и их значений.
    * @interface WS.Data/Types/IEnum
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends WS.Data/Types/IEnum.prototype */{
      /**
       * @event onChange После изменения текущего индекса.
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {Number} index Новый индекс
       * @param {String} value Новое значение
       * @example
       * <pre>
       *    var colors = new Enum({
       *       dictionary: ['Red', 'Green', 'Blue']
       *    });
       *
       *    colors.subscribe('onChange', function(event, index, value) {
       *       console.log('New index: ' + index);
       *       console.log('New value: ' + value);
       *    });
       *
       *    colors.set(0);//'New index: 0', 'New value: Red'
       *    colors.setByValue('Green');//'New index: 1', 'New value: Green'
       * </pre>
       */

      /**
       * Возвращает текущий индекс.
       * @return {Number|Null}
       */
      get: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущий индекс. Если индекс недопустим, кидает исключение.
       * @param {Number|Null} index Текущий индекс
       */
      set: function(index) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает значение, соответствующее текущему индексу.
       * @return {String}
       */
      getAsValue: function() {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает текущий индекс по соответствующему ему значению. Если значение недопустимо, кидает исключение.
       * @param {String} value Текущее значение
       */
      setByValue: function(value) {
         throw new Error('Method must be implemented');
      }
  };
});
