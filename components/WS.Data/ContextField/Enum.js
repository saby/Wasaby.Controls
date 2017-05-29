/* global define */
define('js!WS.Data/ContextField/Enum', [
   'js!WS.Data/ContextField/Base',
   'Core/Context'
], function (
   ContextFieldBase,
   CoreContext
) {
   'use strict';

   /**
    * Поддержка типа перечисляемое в контексте
    * @class WS.Data/ContextField/Enum
    * @extends WS.Data/ContextField/Base
    * @author Мальцев Алексей
    */
   return ContextFieldBase.extend(/** @lends WS.Data/ContextField/Enum.prototype*/{
      _moduleName: 'WS.Data/ContextField/Enum',

      name: 'ControlsFieldTypeEnum',

      /**
       * Возвращает значение поля контекста по пути.
       * @param {WS.Data/Types/Enum} value Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @return {*}
       */
      get: function (value, keyPath) {
         if (keyPath.length === 0) {
            return value;
         }

         return CoreContext.NonExistentValue;
      },

      /**
       * Возвращает признак, что значение поля контекста изменилось
       * @param {WS.Data/Types/Enum} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @param {*} value Значение, сравниваемое с текущим
       * @return {Boolean}
       */
      setWillChange: function (oldValue, keyPath, value) {
         if (keyPath.length === 0) {
            return oldValue !== value;
         }

         return false;
      },

      /**
       * Устанавливает значение поля контекста
       * @param {WS.Data/Types/Enum} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @param {*} value Новое значение
       * @return {*}
       */
      set: function (oldValue, keyPath, value) {
         if (keyPath.length === 0) {
            return value;
         }

         return oldValue;
      },

      /**
       * Удаляет значение поля контекста
       * @param {WS.Data/Types/Enum} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @return {Object}
       */
      remove: function (value, keyPath) {
         return {
            value:  value,
            changed: false
         };
      },

      toJSON: function (value, deep) {
         if (deep) {
            var result = [];
            value.each(function (name ) {
               result.push(name);
            });
            return result;
         }

         return value.get();
      },

      /**
       * Подписывается на изменение поля контекста
       * @param {WS.Data/Types/Enum} value Поле контекста
       * @param {Function} value Обработчик, вызываемый при изменении значения
       * @return {Function} Метод, выполняющий отписку
       */
      subscribe: function (value, fn) {
         value.subscribe('onChange', fn);

         return function () {
            value.unsubscribe('onChange', fn);
         };
      }
   });
});