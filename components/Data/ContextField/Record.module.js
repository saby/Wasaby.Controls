/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Record', [
   'js!SBIS3.CONTROLS.Data.ContextField.RecordMixin',
   'js!SBIS3.CONTROLS.Data.ContextField.ContextFieldMixin'
], function (RecordMixin,ContextFieldMixin) {
   'use strict';

   return $ws.core.extend({}, [ContextFieldMixin, RecordMixin], {
      name: 'ControlsFieldTypeRecord',


      subscribe: function (value, fn) {
         value.subscribe('onPropertyChange', fn);
         return function () {
            value.unsubscribe('onPropertyChange', fn);
         };
      }
   });
});