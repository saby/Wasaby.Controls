define('js!SBIS3.CONTROLSs.Demo.MyCalendar', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyCalendar', 'css!SBIS3.CONTROLSs.Demo.MyCalendar', 'js!SBIS3.CONTROLS.Calendar'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyCalendar
    * @class SBIS3.CONTROLSs.Demo.MyCalendar
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyCalendar.prototype */{
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