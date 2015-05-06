define('js!SBIS3.Controls.Demo.MyTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyTextBox', 'css!SBIS3.Controls.Demo.MyTextBox', 'js!SBIS3.CONTROLS.TextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyTextBox
    * @class SBIS3.Controls.Demo.MyTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyTextBox.prototype */{
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