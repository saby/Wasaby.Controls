define('js!SBIS3.Demo.Control.MyCheckBoxGroup', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyCheckBoxGroup', 'css!SBIS3.Demo.Control.MyCheckBoxGroup', 'js!SBIS3.CONTROLS.CheckBoxGroup'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyCheckBoxGroup
    * @class SBIS3.Demo.Control.MyCheckBoxGroup
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyCheckBoxGroup.prototype */{
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