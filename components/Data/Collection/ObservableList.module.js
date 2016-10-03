/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableList', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/ObservableList"
], function ( IoC, ConsoleLogger,ObservableList) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ObservableList', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/ObservableList instead.');
   return ObservableList;
});
