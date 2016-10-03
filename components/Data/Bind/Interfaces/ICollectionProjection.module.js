/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/IBindCollection"
], function ( IoC, ConsoleLogger,IBindCollection) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Bind.ICollectionProjection', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/IBindCollection instead.');
   return IBindCollection;
});
