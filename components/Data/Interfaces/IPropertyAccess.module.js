/* global define */
define('js!SBIS3.CONTROLS.Data.IPropertyAccess', [], function () {
   'use strict';

   /**
    * Интерфейс доступа к свойствам объекта
    * @mixin SBIS3.CONTROLS.Data.IPropertyAccess
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.IPropertyAccess.prototype */{
      /**
       * @event onPropertyChange После изменения свойства
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} property Измененное свойство
       * @param {*} value Значение свойства
       * @example
       * <pre>
       *    user.subscribe('onPropertyChange', function(event, property){
       *       if (property === 'sex'){
       *          fsb.service.alert('Transgender detected! :)', event.getTarget());
       *       }
       *    });
       * </pre>
       */

      /**
       * Возвращает значение свойства
       * @param {String} name Название свойства
       * @returns {*}
       */
      get: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает значение свойства
       * @param {String} name Название свойства
       * @param {*} value Значение свойства
       */
      set: function (name, value) {
         throw new Error('Method must be implemented');
      }
   };
});
