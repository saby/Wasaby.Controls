/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.HashableMixin', ['js!WS.Data.Entity.HashableMixin'], function (HashableMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.HashableMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.HashableMixin instead');
   return HashableMixin;
});
