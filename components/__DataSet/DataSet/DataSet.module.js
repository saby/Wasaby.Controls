define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
], function (RecordSet) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('DataSet', 'Module SBIS3.CONTROLS.DataSet has been removed in 3.7.3.100. Use SBIS3.CONTROLS.Data.Collection.RecordSet instead');
   return RecordSet;
});
