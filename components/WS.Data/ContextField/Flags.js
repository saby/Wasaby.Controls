/* global define */
define('js!WS.Data/ContextField/Flags', [
   'js!WS.Data/ContextField/RecordMixin',
   'js!WS.Data/ContextField/Base'
], function (
   RecordMixin,
   ContextFieldBase
) {
   'use strict';

   /**
    * Поддержка типа флаги в контексте
    * @class WS.Data/ContextField/Flags
    * @mixes WS.Data/ContextField/RecordMixin
    * @extends WS.Data/ContextField/Base
    * @author Мальцев Алексей
    */
   return ContextFieldBase.extend([RecordMixin], /** @lends WS.Data/ContextField/Flags.prototype*/{
      _moduleName: 'WS.Data/ContextField/Flags',

      name: 'ControlsFieldTypeFlags',

      /**
       * Удаляет значение поля контекста
       * @param {WS.Data/Types/Enum} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @return {Object}
       */
      remove: function (value, keyPath) {
         var changed = keyPath.length !== 0;
         if (changed) {
            value.set(keyPath[0], false);
         }

         return {
            value:  value,
            changed: changed
         };
      },

      toJSON: function (value, deep) {
         if (deep) {
            var result = {};
            value.each(function (name){
               result[name] = value.get(name);
            });
            return result;
         }

         return value.toString();
      }
   });
});

