define('js!SBIS3.CONTROLSs.Demo.MyPasswordTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyPasswordTextBox', 'css!SBIS3.CONTROLSs.Demo.MyPasswordTextBox', 'js!SBIS3.CONTROLS.PasswordTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyPasswordTextBox
    * @class SBIS3.CONTROLSs.Demo.MyPasswordTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyPasswordTextBox.prototype */{
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