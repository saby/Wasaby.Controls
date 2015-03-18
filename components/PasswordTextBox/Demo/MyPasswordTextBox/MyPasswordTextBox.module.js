define('js!SBIS3.Demo.Control.MyPasswordTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyPasswordTextBox', 'css!SBIS3.Demo.Control.MyPasswordTextBox', 'js!SBIS3.CONTROLS.PasswordTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyPasswordTextBox
    * @class SBIS3.Demo.Control.MyPasswordTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyPasswordTextBox.prototype */{
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