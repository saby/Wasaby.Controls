define('js!SBIS3.Controls.Demo.MyDatePicker', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyDatePicker', 'css!SBIS3.Controls.Demo.MyDatePicker', 'js!SBIS3.CONTROLS.DatePicker'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyDatePicker
    * @class SBIS3.Controls.Demo.MyDatePicker
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyDatePicker.prototype */{
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