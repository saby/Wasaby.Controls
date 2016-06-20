/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.DataSet', ['js!WS.Data.Source.DataSet'], function (DataSet) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.DataSet', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Source.DataSet instead.');
   return DataSet;
});
