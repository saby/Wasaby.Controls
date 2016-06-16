/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Utils', ['js!WS.Data.Utils'], function (Utils) {
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Utils', 'Module has been renamed in 3.7.4.100. Use WS.Data.Utils instead');
   return Utils;
});
