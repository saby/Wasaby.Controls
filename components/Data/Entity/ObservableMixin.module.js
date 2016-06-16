/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.ObservableMixin', ['js!WS.Data.Entity.ObservableMixin'], function (ObservableMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Entity.ObservableMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.ObservableMixin instead');
   return ObservableMixin;
});
