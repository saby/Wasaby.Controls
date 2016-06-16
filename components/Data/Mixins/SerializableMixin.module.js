/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', ['js!WS.Data.Entity.SerializableMixin'], function (SerializableMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.SerializableMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.SerializableMixin instead');
   return SerializableMixin;
});
