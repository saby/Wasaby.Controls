define('js!SBIS3.CONTROLSs.Demo.MyNumberTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyNumberTextBox', 'css!SBIS3.CONTROLSs.Demo.MyNumberTextBox', 'js!SBIS3.CONTROLS.NumberTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyNumberTextBox
    * @class SBIS3.CONTROLSs.Demo.MyNumberTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyNumberTextBox.prototype */{
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