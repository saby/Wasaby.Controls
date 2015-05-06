define('js!SBIS3.Controls.Demo.MyMonthPicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyMonthPicker', 'css!SBIS3.Controls.Demo.MyMonthPicker', 'js!SBIS3.CONTROLS.MonthPicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyMonthPicker
    * @class SBIS3.Controls.Demo.MyMonthPicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyMonthPicker.prototype */{
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