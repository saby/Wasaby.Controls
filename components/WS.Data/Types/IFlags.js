/* global define */
define('js!WS.Data/Types/IFlags', [], function () {
   'use strict';

   /**
    * Интерфейс типа флаги.
    * Работает на основе словаря, хранящего соотвествие индексов и их значений.
    * @interface WS.Data/Types/IFlags
    * @public
    * @author Ганшин Ярослав
    */

   return /** @lends WS.Data/Types/IFlags.prototype */{
      /**
       * @event onChange После изменения состояния флага.
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {String} name Название флага
       * @param {Number} index Индекс флага
       * @param {Boolean|Null} value Новое значение флага
       * @example
       * <pre>
       *    var colors = new Flags({
       *       dictionary: ['Red', 'Green', 'Blue']
       *    });
       *
       *    colors.subscribe('onChange', function(event, name, index, value) {
       *       console.log(name + '[' + index + ']: ' + value);
       *    });
       *
       *    colors.set('Red', true);//'Red[0]: true'
       *    colors.setByIndex(1, false);//'Green[1]: false'
       * </pre>
       */

      /**
       * Возвращает состояние флага с именем. Если имя недопустимо, кидает исключение.
       * @param {String} name Название флага
       * @return {Boolean|Null}
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
      }
   };
});
