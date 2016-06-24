/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableList', ['js!WS.Data/Collection/ObservableList'], function (ObservableList) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ObservableList', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/ObservableList instead.');
   return ObservableList;
});
