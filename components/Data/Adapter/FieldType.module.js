define('js!SBIS3.CONTROLS.Data.Adapter.FieldType', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/SbisFieldType"
], function( IoC, ConsoleLogger,FieldType){
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.FieldType', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/SbisFieldType instead.');
   return FieldType;
});
