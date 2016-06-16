/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableListMixin', ['js!WS.Data.Collection.LoadableListMixin'], function (LoadableListMixin) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.LoadableListMixin', 'Module has been renamed in 3.7.4.100. Use WS.Data.Collection.LoadableListMixin instead');
   return LoadableListMixin;
});
