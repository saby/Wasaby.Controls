define('js!SBIS3.CONTROLS.Demo.MyComboBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyComboBox', 'css!SBIS3.CONTROLS.Demo.MyComboBox', 'js!SBIS3.CONTROLS.ComboBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyComboBox
    * @class SBIS3.CONTROLS.Demo.MyComboBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyComboBox.prototype */{
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