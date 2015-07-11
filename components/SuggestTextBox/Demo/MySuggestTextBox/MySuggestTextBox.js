define('js!SBIS3.CONTROLS.Demo.MySuggestTextBox', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'css!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'js!SBIS3.CONTROLS.SuggestTextBox'
], function (CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MySuggestTextBox
    * @class SBIS3.CONTROLS.Demo.MySuggestTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySuggestTextBox.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         moduleClass.superclass.init.call(this);
      }
   });
   return moduleClass;
});
