/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField', [
], function () {
   'use strict';

   /**
    * Позволяет зарегистрировать свой тип поля в контексте
    * @class SBIS3.CONTROLS.Data.ContextField
    * @public
    * @author Мальцев Алексей
    */

   var ContextField = /**@lends SBIS3.CONTROLS.Data.ContextField.prototype  */{
      /**
       * Регистрирует тип поля в контексте
       * @param {String} name Название типа
       * @param {Function} module Реализация типа
       * @param {String} changeEvent Название события, сигнализирующего об изменении инстанса типа
       * @static
       */
      register: function (name, module, changeEvent) {
         $ws.proto.Context.registerFieldType({
            name: name,

            is: function(value) {
               return value instanceof module;
            },

            get: function(value, keyPath) {
               var
                  Context = $ws.proto.Context,
                  NonExistentValue = Context.NonExistentValue,

                  key, result, subValue, subType;

               if (keyPath.length !== 0) {
                  key = keyPath[0];
                  subValue = value.get(key);
                  if (subValue !== undefined) {
                     subType = Context.getValueType(subValue);
                     result = subType.get(subValue, keyPath.slice(1));
                  } else {
                     result = NonExistentValue;
                  }
               } else {
                  result = value;
               }

               return result;
            },

            setWillChange: function(oldValue, keyPath, value) {
               var
                  Context = $ws.proto.Context,
                  result, subValue, key, subType;

               if (keyPath.length !== 0) {
                  key = keyPath[0];
                  subValue = oldValue.get(key);
                  result = subValue !== undefined;
                  if (result) {
                     subType = Context.getValueType(subValue);
                     result = subType.setWillChange(subValue, keyPath.slice(1), value);
                  }
               } else {
                  //TODO: неточная вторая проверка
                  result = !ContextField.is(value) || !$ws.helpers.isEqualObject(oldValue, value);
               }

               return result;
            },

            set: function(oldValue, keyPath, value) {
               var
                  Context = $ws.proto.Context,
                  result, subValue, key, subType;

               if (keyPath.length !== 0) {
                  key = keyPath[0];
                  subValue = oldValue.get(key);
                  if (subValue !== undefined) {
                     if (keyPath.length === 1) {
                        oldValue.set(key, value);
                     }
                     else {
                        subType = Context.getValueType(subValue);
                        subType.set(subValue, keyPath.slice(1), value);
                     }
                  }
                  result = oldValue;
               } else {
                  result = value;
               }

               return result;
            },

            remove: function(oldValue, keyPath) {

            },

            toJSON: function(value, deep) {
               return deep ? value.toObject() : value;
            },

            subscribe: function(value, fn) {
               value.subscribe(changeEvent, fn);
               return function() {
                  value.unsubscribe(changeEvent, fn);
               };
            }
         });
      }
   };

   return ContextField;
});
