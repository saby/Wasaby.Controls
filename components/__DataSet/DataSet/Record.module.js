define('js!SBIS3.CONTROLS.Record', [
   'js!SBIS3.CONTROLS.Data.Model'
], function (Model) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('Record', 'Module SBIS3.CONTROLS.Record has been removed in 3.7.3.100. Use SBIS3.CONTROLS.Data.Model instead');
   return Model;
});