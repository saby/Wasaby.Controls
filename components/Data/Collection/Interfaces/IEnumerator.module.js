/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IEnumerator', ['js!WS.Data.Collection.IEnumerator'], function (IEnumerator) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.IEnumerator', 'Module has been renamed in 3.7.4.100. Use WS.Data.Collection.IEnumerator instead');
   return IEnumerator;
});
