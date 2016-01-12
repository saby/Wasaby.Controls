define('js!SBIS3.CONTROLS.Record', [
   'js!SBIS3.CONTROLS.Data.Model'
], function (Model) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').log('Record', 'С 3.7.3.20 класс SBIS3.CONTROLS.Record устарел, используйте SBIS3.CONTROLS.Data.Model');
   return Model;
});