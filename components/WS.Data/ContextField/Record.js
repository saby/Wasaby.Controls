/* global define */
define('js!WS.Data/ContextField/Record', [
   'js!WS.Data/ContextField/RecordMixin',
   'js!WS.Data/ContextField/Base'
], function (
   RecordMixin,
   ContextFieldBase
) {
   'use strict';

   /**
    * Поддержка типа запись в контексте
    * @class WS.Data/ContextField/Record
    * @mixes WS.Data/ContextField/RecordMixin
    * @extends WS.Data/ContextField/Base
    * @author Мальцев Алексей
    */
   return ContextFieldBase.extend([RecordMixin], /** @lends WS.Data/ContextField/Record.prototype*/{
      _moduleName: 'WS.Data/ContextField/Record',

      name: 'ControlsFieldTypeRecord',

      /**
       * Подписывается на изменение поля контекста
       * @param {WS.Data/Entity/Record} value Поле контекста
       * @param {Function} value Обработчик, вызываемый при изменении значения
       * @return {Function} Метод, выполняющий отписку
       */
      subscribe: function (value, fn) {
         var handler = fn.debounce(0);
         value.subscribe('onPropertyChange', handler);

         return function () {
            value.unsubscribe('onPropertyChange', handler);
         };
      }
   });
});