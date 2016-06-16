/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.XmlField', ['js!WS.Data.Format.XmlField'], function (XmlField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.XmlField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.XmlField instead');
   return XmlField;
});
