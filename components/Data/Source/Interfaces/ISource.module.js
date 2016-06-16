/* global define */
define('js!SBIS3.CONTROLS.Data.Source.ISource', ['js!WS.Data.Source.ISource'], function (ISource) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.ISource', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.ISource instead');
   return ISource;
});
