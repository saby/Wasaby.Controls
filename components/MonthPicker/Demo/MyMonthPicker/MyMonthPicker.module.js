define('js!SBIS3.CONTROLS.Demo.MyMonthPicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyMonthPicker', 'css!SBIS3.CONTROLS.Demo.MyMonthPicker', 'js!SBIS3.CONTROLS.MonthPicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyMonthPicker
    * @class SBIS3.CONTROLS.Demo.MyMonthPicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyMonthPicker.prototype */{
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