/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableList', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/LoadableList"
], function ( IoC, ConsoleLogger,LoadableList) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.LoadableList', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/LoadableList instead.');
   return LoadableList;
});
