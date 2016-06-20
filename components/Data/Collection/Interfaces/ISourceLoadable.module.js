/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable', ['js!WS.Data.Collection.ISourceLoadable'], function (ISourceLoadable) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.ISourceLoadable', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Collection.ISourceLoadable instead.');
   return ISourceLoadable;
});
