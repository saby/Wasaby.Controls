/* global define */
define('js!SBIS3.CONTROLS.Data.OneToManyMixin', ['js!WS.Data.Entity.OneToManyMixin'], function (OneToManyMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.OneToManyMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.OneToManyMixin instead');
   return OneToManyMixin;
});
