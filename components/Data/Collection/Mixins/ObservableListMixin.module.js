/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin', ['js!WS.Data.Collection.ObservableListMixin'], function (ObservableListMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ObservableListMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Collection.ObservableListMixin instead');
   return ObservableListMixin;
});
