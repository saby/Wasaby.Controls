define('js!SBIS3.CONTROLS.Demo.MyFormattedTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyFormattedTextBox', 'css!SBIS3.CONTROLS.Demo.MyFormattedTextBox', 'js!SBIS3.CONTROLS.FormattedTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyFormattedTextBox
    * @class SBIS3.CONTROLS.Demo.MyFormattedTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyFormattedTextBox.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
      }
   });
   return moduleClass;
});