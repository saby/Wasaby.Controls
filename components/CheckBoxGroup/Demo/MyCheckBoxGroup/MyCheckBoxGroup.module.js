define('js!SBIS3.Controls.Demo.MyCheckBoxGroup', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyCheckBoxGroup', 'css!SBIS3.Controls.Demo.MyCheckBoxGroup', 'js!SBIS3.CONTROLS.CheckBoxGroup'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyCheckBoxGroup
    * @class SBIS3.Controls.Demo.MyCheckBoxGroup
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyCheckBoxGroup.prototype */{
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