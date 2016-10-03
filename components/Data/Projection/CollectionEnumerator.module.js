/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/CollectionEnumerator"
], function ( IoC, ConsoleLogger,CollectionEnumerator) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.CollectionEnumerator', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/CollectionEnumerator instead.');
   return CollectionEnumerator;
});
