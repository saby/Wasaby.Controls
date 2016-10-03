/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableListMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/LoadableListMixin"
], function ( IoC, ConsoleLogger,LoadableListMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.LoadableListMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/LoadableListMixin instead.');
   return LoadableListMixin;
});
