define('js!SBIS3.Demo.Control.MyDatePicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyDatePicker', 'css!SBIS3.Demo.Control.MyDatePicker', 'js!SBIS3.CONTROLS.DatePicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyDatePicker
    * @class SBIS3.Demo.Control.MyDatePicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyDatePicker.prototype */{
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