/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', ['js!WS.Data.Entity.FormattableMixin'], function (FormattableMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.FormattableMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.FormattableMixin instead');
   return FormattableMixin;
});
