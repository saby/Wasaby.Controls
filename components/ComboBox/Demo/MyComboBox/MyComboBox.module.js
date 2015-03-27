define('js!SBIS3.Demo.Control.MyComboBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyComboBox', 'css!SBIS3.Demo.Control.MyComboBox', 'js!SBIS3.CONTROLS.ComboBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyComboBox
    * @class SBIS3.Demo.Control.MyComboBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyComboBox.prototype */{
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