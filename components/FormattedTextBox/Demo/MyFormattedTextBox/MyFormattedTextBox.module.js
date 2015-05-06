define('js!SBIS3.Controls.Demo.MyFormattedTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyFormattedTextBox', 'css!SBIS3.Controls.Demo.MyFormattedTextBox', 'js!SBIS3.CONTROLS.FormattedTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyFormattedTextBox
    * @class SBIS3.Controls.Demo.MyFormattedTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyFormattedTextBox.prototype */{
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