/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Enum', [
   'js!SBIS3.CONTROLS.Data.ContextField.ContextFieldMixin'
], function (ContextFieldMixin) {
   'use strict';

   return $ws.core.extend({},[ContextFieldMixin], {
      $protected: {
         _options: {
            module: undefined
         }

      },
      name: 'ControlsFieldTypeEnum',

      get: function (value, keyPath) {
         var result;

         if (keyPath.length === 0) {
            return value;
         } else  {
            return $ws.proto.Context.NonExistentValue;
         }
      },

      setWillChange: function (oldValue, keyPath, value) {
         var result;

         if (keyPath.length === 0) {
            result = oldValue.equals(value);
         } else  {
            result = false;
         }

         return result;
      },

      set: function (oldValue, keyPath, value) {
         if (keyPath.length === 0) {
            return value;
         }
         else {
            return oldValue;
         }
      },

      remove: function (value, keyPath) {
         return {
            value:  value,
            changed: false
         };
      },

      toJSON: function (value, deep) {
         if (deep) {
            var result = [];
            value.each(function (name ){
               result.push(name);
            });
            return result;
         }

         return value.get();
      }

   });
});