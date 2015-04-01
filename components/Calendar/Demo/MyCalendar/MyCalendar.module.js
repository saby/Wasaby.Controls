define('js!SBIS3.Demo.Control.MyCalendar', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyCalendar', 'css!SBIS3.Demo.Control.MyCalendar', 'js!SBIS3.CONTROLS.Calendar'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyCalendar
    * @class SBIS3.Demo.Control.MyCalendar
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyCalendar.prototype */{
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