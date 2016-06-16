/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IAbstract', ['js!WS.Data.Source.Provider.IAbstract'], function (IAbstract) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.IAbstract', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.Provider.IAbstract instead');
   return IAbstract;
});
