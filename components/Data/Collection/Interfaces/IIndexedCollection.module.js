/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection', ['js!WS.Data.Collection.IIndexedCollection'], function (IIndexedCollection) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.IIndexedCollection', 'Module has been renamed in 3.7.4.100. Use WS.Data.Collection.IIndexedCollection instead');
   return IIndexedCollection;
});
