/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/IndexedEnumeratorMixin"
], function ( IoC, ConsoleLogger,IndexedEnumeratorMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/IndexedEnumeratorMixin instead.');
   return IndexedEnumeratorMixin;
});
