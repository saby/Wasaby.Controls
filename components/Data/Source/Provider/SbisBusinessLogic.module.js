/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', ['js!WS.Data.Source.Provider.SbisBusinessLogic'], function (SbisBusinessLogic) {
    'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.Provider.SbisBusinessLogic instead');
   return SbisBusinessLogic;
});
