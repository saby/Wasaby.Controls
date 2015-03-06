define('js!SBIS3.Demo.Control.MyNumberTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyNumberTextBox', 'css!SBIS3.Demo.Control.MyNumberTextBox', 'js!SBIS3.CONTROLS.NumberTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyNumberTextBox
    * @class SBIS3.Demo.Control.MyNumberTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyNumberTextBox.prototype */{
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