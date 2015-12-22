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
      registerRecord: function (name, module, changeEvent) {
         $ws.proto.Context.registerFieldType({
            name: name,

            is: function (value) {
               return value instanceof module;
            },

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
                  } else {
                     result = NonExistentValue;
                  }
               } else {
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
                  result = subValue !== undefined;
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
                     } else {
                        subType = Context.getValueType(subValue);
                        changed = subType.remove(subValue, keyPath.slice(1)).changed;
                     }
                  }
               }
               return {
                  value: record,
                  changed: changed
               };
            },

            toJSON: function (value, deep) {
               return deep ? value.toObject() : value;
            },

            subscribe: function (value, fn) {
               value.subscribe(changeEvent, fn);
               return function () {
                  value.unsubscribe(changeEvent, fn);
               };
            }
         });
      },
      registerDataSet: function (name, module, changeEvent) {
         $ws.proto.Context.registerFieldType({
            name: name,

            is: function (value) {
               return value instanceof module;
            },

            //Встроенный record отдаёт значения только по одному уровню
            get: function (value, keyPath) {
               var
                   Context = $ws.proto.Context,
                   NonExistentValue = $ws.proto.Context.NonExistentValue,
                   recordSet = value,
                   count = recordSet.getCount(),
                   idx, result, subValue, key, subType;

               if (keyPath.length !== 0) {
                  key = keyPath[0];
                  idx = getRsIdx(key);

                  if (idx >= 0 && idx < count) {//at
                     subValue = recordSet.at(idx);
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

            setWillChange: function (oldValue, keyPath, value) {
               var
                   Context = $ws.proto.Context,
                   recordSet = oldValue,
                   count = recordSet.getCount(),
                   result,
                   idx, subValue, key, subType;

               if (keyPath.length !== 0) {
                  key = keyPath[0];
                  idx = getRsIdx(key);

                  result = keyPath.length > 1 && idx >= 0 && idx < count;

                  if (result) { //TODO: а удаление/переустановка записи как (keyPath.length === 1) ???
                     subValue = recordSet.at(idx);
                     subType = Context.getValueType(subValue);
                     result = subType.setWillChange(subValue, keyPath.slice(1), value);
                  }
               } else {
                  result = !oldValue.equals(value);
               }

               return result;
            },

            set: function (oldValue, keyPath, value) {
               var
                   Context = $ws.proto.Context,
                   recordSet = oldValue,
                   count = recordSet.getCount(),
                   result, changed, idx, subValue, key, subType;

               if (keyPath.length !== 0) {
                  key = keyPath[0];
                  idx = getRsIdx(key);

                  changed = idx >= 0 && idx < count;
                  if (changed) {
                     if (keyPath.length !== 1) { //TODO: а удаление/переустановка записи как (keyPath.length === 1) ???
                        subValue = recordSet.at(idx);
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

            remove: function (oldValue, keyPath) {
               var
                   changed,
                   Context = $ws.proto.Context,
                   recordSet = oldValue,
                   count = recordSet.getCount(),
                   idx, subValue, key, subType;

               changed = keyPath.length !== 0;
               if (changed) {
                  key = keyPath[0];
                  idx = getRsIdx(key);

                  changed = keyPath.length > 1 && idx >= 0 && idx < count;//TODO: а удаление/переустановка записи как (keyPath.length === 1) ???
                  if (changed) {
                     subValue = recordSet.at(idx);
                     subType = Context.getValueType(subValue);
                     changed = subType.remove(subValue, keyPath.slice(1)).changed;
                  }
               }

               return {
                  value: oldValue,
                  changed: changed
               };
            },

            toJSON: function (value, deep) {
               return deep ? value.toJSON() : value;
            },

            subscribe: function (value, fn) {
               value.subscribe(changeEvent, fn);
               return function () {
                  value.unsubscribe(changeEvent, fn);
               };
            }
         });
      }
   },
   getRsIdx = function(id) {
      return String.prototype.split.call(id, ',')[0];
   };

   return ContextField;
});
