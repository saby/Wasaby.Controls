/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Memory', ['js!WS.Data/Source/Memory'], function (Memory) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Memory', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Memory instead.');
   return Memory;
});
