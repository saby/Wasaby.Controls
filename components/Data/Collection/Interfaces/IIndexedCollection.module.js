/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/IIndexedCollection"
], function ( IoC, ConsoleLogger,IIndexedCollection) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.IIndexedCollection', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/IIndexedCollection instead.');
   return IIndexedCollection;
});
