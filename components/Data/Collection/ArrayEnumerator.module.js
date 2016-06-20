/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', ['js!WS.Data.Collection.ArrayEnumerator'], function (ArrayEnumerator) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Collection.ArrayEnumerator instead.');
   return ArrayEnumerator;
});
