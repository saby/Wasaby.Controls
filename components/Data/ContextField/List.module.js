/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.List', [
   'js!SBIS3.CONTROLS.Data.ContextField.Base'
], function (ContextFieldBase) {
   'use strict';

   /**
    * Поддержка типа список в контексте
    * @class SBIS3.CONTROLS.Data.ContextField.List
    * @extends SBIS3.CONTROLS.Data.ContextField.Base
    * @author Мальцев Алексей
    */
   var ContextFieldRecordSet =  $ws.core.extend(ContextFieldBase, [], /** @lends SBIS3.CONTROLS.Data.ContextField.List.prototype*/{
      $protected: {
         _options: {
            module: undefined
         }

      },

      name: 'ControlsFieldTypeList',

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
            //При сравнении рекордсетов по данным мы рискуем попасть в ситуацию когда рекордсет изменяют а в связанном листвью ни чего не происходит
            result = oldValue !== value;
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
         var handler = fn.debounce(1);
         value.subscribe('onCollectionItemChange', handler);
         return function () {
            value.unsubscribe('onCollectionItemChange', handler);
         };
      }
   });
   function getRsIdx(id) {
      return String.prototype.split.call(id, ',')[0];
   }
   return ContextFieldRecordSet;
});
