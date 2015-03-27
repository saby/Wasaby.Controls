define('js!SBIS3.Demo.Control.MyTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyTextBox', 'css!SBIS3.Demo.Control.MyTextBox', 'js!SBIS3.CONTROLS.TextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyTextBox
    * @class SBIS3.Demo.Control.MyTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyTextBox.prototype */{
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