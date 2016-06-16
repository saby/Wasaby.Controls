/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.RecordMixin', ['js!WS.Data.ContextField.RecordMixin'], function (RecordMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.RecordMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.ContextField.RecordMixin instead');
   return RecordMixin;
});
