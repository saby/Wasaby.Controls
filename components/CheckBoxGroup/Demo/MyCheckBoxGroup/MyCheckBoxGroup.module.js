define('js!SBIS3.CONTROLS.Demo.MyCheckBoxGroup', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyCheckBoxGroup', 'css!SBIS3.CONTROLS.Demo.MyCheckBoxGroup', 'js!SBIS3.CONTROLS.CheckBoxGroup'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyCheckBoxGroup
    * @class SBIS3.CONTROLS.Demo.MyCheckBoxGroup
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyCheckBoxGroup.prototype */{
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