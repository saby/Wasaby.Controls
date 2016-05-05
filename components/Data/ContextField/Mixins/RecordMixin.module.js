/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.RecordMixin', [], function () {
   'use strict';

   /**
    * Миксин, определяющий работу с рекордом в контексте
    * @mixin SBIS3.CONTROLS.Data.ContextField.RecordMixin
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.ContextField.RecordMixin.prototype*/{
      get: function (value, keyPath) {
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
            }
            else {
               result = NonExistentValue;
            }
         }
         else {
            result = value;
         }
         return result;
      },
      setWillChange: function (oldValue, keyPath, value) {
         var
             Context = $ws.proto.Context,
             result, subValue, key, subType;

         if (keyPath.length !== 0) {
            key = keyPath[0];
            subValue = oldValue.get(key);

            /* Если есть owner (recordSet), то мы не можем менять формат записи */
            if(oldValue.getOwner && oldValue.getOwner() === null) {
               result = subValue !== value;
            } else {
               result = subValue !== undefined;
            }

            if (result) {
               subType = Context.getValueType(subValue);
               result = subType.setWillChange(subValue, keyPath.slice(1), value);
            }
         } else {
            result = oldValue !== value;
         }

         return result;
      },
      set: function (oldValue, keyPath, value) {
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
            } else if(subValue === undefined && keyPath.length === 1) {
               /* Если поля в записи нет, пробуем его добавить */
               if(!oldValue.has(key)) {
                  oldValue.addField({name: key, type: 'string'});
               }
               oldValue.set(key, value);
            }
            result = oldValue;
         } else {
            result = value;
         }

         return result;
      },
      remove: function (oldValue, keyPath) {
         var
            key, subValue, subType,
            newValue, length, i, changed,
            Context = $ws.proto.Context,
            record = oldValue;
         changed = keyPath.length !== 0;
         if (changed) {
            key = keyPath[0];
            changed = record.has(key);
            if (changed) {
               subValue = record.get(key);
               changed = keyPath.length === 1;
               if (changed) {
                  //TODO Сделать нормальную работу с полями типа "Enum" и "флаги"
                  changed = subValue !== null;
                  if (changed) {
                     record.set(key, null);
                  }
               }
               else {
                  subType = Context.getValueType(subValue);
                  changed = subType.remove(subValue, keyPath.slice(1)).changed;
               }
            }
         }
         return {
            value: record,
            changed: changed
         };
      }
   };
});