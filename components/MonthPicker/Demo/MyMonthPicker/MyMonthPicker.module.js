define('js!SBIS3.CONTROLSs.Demo.MyMonthPicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyMonthPicker', 'css!SBIS3.CONTROLSs.Demo.MyMonthPicker', 'js!SBIS3.CONTROLS.MonthPicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyMonthPicker
    * @class SBIS3.CONTROLSs.Demo.MyMonthPicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyMonthPicker.prototype */{
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