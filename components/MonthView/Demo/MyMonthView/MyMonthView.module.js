define('js!SBIS3.CONTROLS.Demo.MyMonthView', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyMonthView', 'css!SBIS3.CONTROLS.Demo.MyMonthView', 'js!SBIS3.CONTROLS.MonthView'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyMonthView
    * @class SBIS3.CONTROLS.Demo.MyMonthView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyMonthView.prototype */{
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