/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Flags', [
   'js!SBIS3.CONTROLS.Data.ContextField.RecordMixin',
   'js!SBIS3.CONTROLS.Data.ContextField.ContextFieldMixin'
], function (RecordMixin, ContextFieldMixin) {
   'use strict';

   return $ws.core.extend({}, [ContextFieldMixin, RecordMixin], {
      $protected: {
         _options: {
            module: undefined
         }

      },
      name: 'ControlsFieldTypeFlags',

      toJSON: function (value, deep) {
         if (deep) {
            var result = {};
            value.each(function (name){
               result[name] = value.get(name);
            });
            return result;
         }

         return value.get();
      }
   });
});

