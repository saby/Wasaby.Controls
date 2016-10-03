/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/ArrayEnumerator"
], function ( IoC, ConsoleLogger,ArrayEnumerator) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/ArrayEnumerator instead.');
   return ArrayEnumerator;
});
