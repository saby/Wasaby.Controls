define('js!SBIS3.Controls.Demo.MyComboBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyComboBox', 'css!SBIS3.Controls.Demo.MyComboBox', 'js!SBIS3.CONTROLS.ComboBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyComboBox
    * @class SBIS3.Controls.Demo.MyComboBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyComboBox.prototype */{
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