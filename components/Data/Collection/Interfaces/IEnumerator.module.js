/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IEnumerator', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/IEnumerator"
], function ( IoC, ConsoleLogger,IEnumerator) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.IEnumerator', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/IEnumerator instead.');
   return IEnumerator;
});
