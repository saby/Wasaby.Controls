define('js!SBIS3.CONTROLS.Demo.MyTabButtons', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyTabButtons',
   'js!SBIS3.CONTROLS.TabButtons'
], function (CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyTabButtons
    * @class SBIS3.CONTROLS.Demo.MyTabButtons
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyTabButtons = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTabButtons.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         MyTabButtons.superclass.init.call(this);
      }
   });
   return MyTabButtons;
});