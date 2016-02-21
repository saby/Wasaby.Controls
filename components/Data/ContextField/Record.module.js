/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Record', [
   'js!SBIS3.CONTROLS.Data.ContextField.RecordMixin',
   'js!SBIS3.CONTROLS.Data.ContextField.Base'
], function (RecordMixin, ContextFieldBase) {
   'use strict';

   return $ws.core.extend(ContextFieldBase, [RecordMixin], {
      name: 'ControlsFieldTypeRecord',

      subscribe: function (value, fn) {
         value.subscribe('onPropertyChange', fn);
         return function () {
            value.unsubscribe('onPropertyChange', fn);
         };
      }
   });
});