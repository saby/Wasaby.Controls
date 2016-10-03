/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/ObservableListMixin"
], function ( IoC, ConsoleLogger,ObservableListMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ObservableListMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/ObservableListMixin instead.');
   return ObservableListMixin;
});
