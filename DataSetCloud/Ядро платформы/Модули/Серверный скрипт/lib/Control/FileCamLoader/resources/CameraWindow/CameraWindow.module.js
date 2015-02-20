/**
 * Модуль "Диалог выбора изображения с камеры".
 * @description
 */
define('js!SBIS3.CORE.CameraWindow', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CORE.CameraWindow',
   'js!SBIS3.CORE.Button',
   'js!SBIS3.CORE.CloseButton',
   'css!SBIS3.CORE.CameraWindow'
], function(CompoundControl, dotTplFn) {

   var Dialog;
   Dialog = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      _closeButton__onActivated: function () {
         this.getTopParent().close(false);
      },
      _loadButton__onActivated: function () {
         this.getTopParent().close(true);
      }
   });

   Dialog.dimensions = { width: 640, height: 480};

   return Dialog;
});