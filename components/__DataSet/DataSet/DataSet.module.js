define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
], function (DataSet) {
   'use strict';

   $ws.single.ioc.resolve('ILogger').log('DataSet', 'С 3.7.3.20 класс SBIS3.CONTROLS.DataSet устарел, используйте SBIS3.CONTROLS.Data.Source.DataSet');
   return DataSet;
});
