define('js!SBIS3.Demo.Control.MyMonthPicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyMonthPicker', 'css!SBIS3.Demo.Control.MyMonthPicker', 'js!SBIS3.CONTROLS.MonthPicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyMonthPicker
    * @class SBIS3.Demo.Control.MyMonthPicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyMonthPicker.prototype */{
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