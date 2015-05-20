define('js!SBIS3.CONTROLS.Demo.MyDatePicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyDatePicker', 'css!SBIS3.CONTROLS.Demo.MyDatePicker', 'js!SBIS3.CONTROLS.DatePicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyDatePicker
    * @class SBIS3.CONTROLS.Demo.MyDatePicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDatePicker.prototype */{
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