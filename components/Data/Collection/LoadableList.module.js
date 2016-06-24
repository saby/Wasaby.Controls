/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableList', ['js!WS.Data/Collection/LoadableList'], function (LoadableList) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.LoadableList', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/LoadableList instead.');
   return LoadableList;
});
