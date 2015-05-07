define('js!SBIS3.CONTROLSs.Demo.MyCheckbox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyCheckbox', 'css!SBIS3.CONTROLSs.Demo.MyCheckbox', 'js!SBIS3.CONTROLS.CheckBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyCheckbox
    * @class SBIS3.CONTROLSs.Demo.MyCheckbox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyCheckbox.prototype */{
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