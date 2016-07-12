/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IChannel', ['js!WS.Data/Source/Provider/IChannel'], function (IChannel) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.IChannel', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Provider/IChannel instead.');
   return IChannel;
});
