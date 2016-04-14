/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Record', [
   'js!SBIS3.CONTROLS.Data.ContextField.RecordMixin',
   'js!SBIS3.CONTROLS.Data.ContextField.Base'
], function (RecordMixin, ContextFieldBase) {
   'use strict';

   /**
    * Поддержка типа запись в контексте
    * @class SBIS3.CONTROLS.Data.ContextField.Record
    * @mixes SBIS3.CONTROLS.Data.ContextField.RecordMixin
    * @extends SBIS3.CONTROLS.Data.ContextField.Base
    * @author Мальцев Алексей
    */
   return $ws.core.extend(ContextFieldBase, [RecordMixin], /** @lends SBIS3.CONTROLS.Data.ContextField.Record.prototype*/{
      name: 'ControlsFieldTypeRecord',

      subscribe: function (value, fn) {
         var handler = fn.debounce(1);
         value.subscribe('onPropertyChange', handler);
         return function () {
            value.unsubscribe('onPropertyChange', handler);
         };
      }
   });
});