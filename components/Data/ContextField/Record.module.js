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
         value.subscribe('onPropertyChange', fn);
         return function () {
            value.unsubscribe('onPropertyChange', fn);
         };
      }
   });
});