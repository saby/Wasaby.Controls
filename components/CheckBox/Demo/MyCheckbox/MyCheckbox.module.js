define('js!SBIS3.Demo.Control.MyCheckbox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyCheckbox', 'css!SBIS3.Demo.Control.MyCheckbox', 'js!SBIS3.CONTROLS.CheckBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyCheckbox
    * @class SBIS3.Demo.Control.MyCheckbox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyCheckbox.prototype */{
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