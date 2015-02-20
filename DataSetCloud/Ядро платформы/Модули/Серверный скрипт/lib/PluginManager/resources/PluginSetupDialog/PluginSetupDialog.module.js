/**
 * Модуль "Диалог установки плагина".
 * @description
 */
define('js!SBIS3.CORE.PluginSetupDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CORE.PluginSetupDialog',
   'js!SBIS3.CORE.Button',
   'js!SBIS3.CORE.CloseButton',
   'css!SBIS3.CORE.PluginSetupDialog'
], function(CompoundControl, dotTplFn) {

   var Dialog;
   Dialog = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });

   Dialog.dimensions = { width: 580, height: 230};

   return Dialog;
});