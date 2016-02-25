/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Flags', [
   'js!SBIS3.CONTROLS.Data.ContextField.RecordMixin',
   'js!SBIS3.CONTROLS.Data.ContextField.Base'
], function (RecordMixin, ContextFieldBase) {
   'use strict';

   /**
    * Поддержка типа флаги в контексте
    * @class SBIS3.CONTROLS.Data.ContextField.Flags
    * @mixes SBIS3.CONTROLS.Data.ContextField.RecordMixin
    * @extends SBIS3.CONTROLS.Data.ContextField.Base
    * @author Мальцев Алексей
    */
   return $ws.core.extend(ContextFieldBase, [RecordMixin], /** @lends SBIS3.CONTROLS.Data.ContextField.Flags.prototype*/{
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

