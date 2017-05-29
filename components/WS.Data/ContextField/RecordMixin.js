/* global define */
define('js!WS.Data/ContextField/RecordMixin', [
   'Core/core-instance',
   'Core/Context'
], function (
   CoreInstance,
   CoreContext
) {
   'use strict';

   /**
    * Миксин, определяющий работу с рекордом в контексте
    * @mixin WS.Data/ContextField/RecordMixin
    * @author Мальцев Алексей
    */
   var RecordMixin = /** @lends WS.Data/ContextField/RecordMixin.prototype*/{
      /**
       * Возвращает значение поля контекста по пути.
       * @param {WS.Data/Entity/Record} value Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @return {*}
       */
      get: function (value, keyPath) {
         var key,
            subValue,
            subType;

         if (keyPath.length === 0) {
            return value;
         }

         key = keyPath[0];
         subValue = value.get(key);
         if (subValue === undefined) {
            return CoreContext.NonExistentValue;
         }

         subType = CoreContext.getValueType(subValue);
         return subType.get(subValue, keyPath.slice(1));
      },

      /**
       * Возвращает признак, что значение поля контекста изменилось
       * @param {WS.Data/Entity/Record} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @param {*} value Значение, сравниваемое с текущим
       * @return {Boolean}
       */
      setWillChange: function (oldValue, keyPath, value) {
         var result,
            subValue,
            key,
            subType;

         if (keyPath.length === 0) {
            return oldValue !== value;
         }

         key = keyPath[0];
         subValue = oldValue.get(key);

         // Если есть owner (RecordSet), то мы не можем менять формат записи
         if (oldValue.getOwner &&
            oldValue.getOwner() &&
            CoreInstance.instanceOfModule(oldValue.getOwner(), 'WS.Data/Collection/RecordSet')
         ) {
            result = subValue !== undefined;
         } else {
            result = subValue !== value;
         }

         if (result) {
            subType = CoreContext.getValueType(subValue);
            result = subType.setWillChange(subValue, keyPath.slice(1), value);
         }

         return result;
      },

      /**
       * Устанавливает значение поля контекста
       * @param {WS.Data/Entity/Record} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @param {*} value Новое значение
       * @return {*}
       */
      set: function (oldValue, keyPath, value) {
         var result,
            subValue,
            newSubValue,
            key,
            subType;

         if (keyPath.length === 0) {
            return value;
         }

         key = keyPath[0];
         subValue = oldValue.get(key);
         if (subValue !== undefined) {
            if (keyPath.length === 1) {
               oldValue.set(key, value);
               result = oldValue;
            } else {
               subType = CoreContext.getValueType(subValue);
               newSubValue = subType.set(subValue, keyPath.slice(1), value);
               if (subValue === newSubValue) {
                  result = oldValue;
               } else {
                  result = RecordMixin.set(oldValue, [key], newSubValue);
               }
            }
         } else if (subValue === undefined && keyPath.length === 1) {
            // Если поля в записи нет, попробуем его добавить
            if (oldValue.has(key)) {
               oldValue.set(key, value);
            } else {
               this._module.addFieldTo(oldValue, key, value);
            }
            result = oldValue;
         }

         return result;
      },

      /**
       * Удаляет значение поля контекста
       * @param {WS.Data/Entity/Record} oldValue Поле контекста
       * @param {Array.<String>} keyPath Путь до значения
       * @return {Object}
       */
      remove: function (oldValue, keyPath) {
         var key,
            subValue,
            subType,
            res,
            changed;

         changed = keyPath.length !== 0;
         if (changed) {
            key = keyPath[0];
            changed = oldValue.has(key);
            if (changed) {
               subValue = oldValue.get(key);
               changed = keyPath.length === 1;
               if (changed) {
                  changed = subValue !== null;
                  if (changed) {
                     oldValue.set(key, null);
                  }
               } else {
                  subType = CoreContext.getValueType(subValue);
                  res = subType.remove(subValue, keyPath.slice(1));
                  changed = res.changed;
                  if (changed) {
                     oldValue.set(key, res.value);
                  }
               }
            }
         }

         return {
            value: oldValue,
            changed: changed
         };
      }
   };

   return RecordMixin;
});