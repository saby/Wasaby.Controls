/**
 * Created by shilovda on 05.09.2014.
 * Модуль "Диалог установки плагина".
 * @description
 */
define('js!SBIS3.CORE.SelectScannerDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CORE.SelectScannerDialog',
   'js!SBIS3.CORE.TableView',
   'js!SBIS3.CORE.CloseButton',
   'css!SBIS3.CORE.SelectScannerDialog'
], function(CompoundControl, dotTplFn) {

   var Dialog;
   Dialog = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            width: 500
         }
      }
   });

   return Dialog;
});