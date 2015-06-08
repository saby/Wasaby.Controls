define('js!SBIS3.CONTROLS.Demo.MyRadioGroup', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyRadioGroup', 'css!SBIS3.CONTROLS.Demo.MyRadioGroup', 'js!SBIS3.CONTROLS.RadioGroup'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyRadioGroup
    * @class SBIS3.CONTROLS.Demo.MyRadioGroup
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyRadioGroup.prototype */{
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