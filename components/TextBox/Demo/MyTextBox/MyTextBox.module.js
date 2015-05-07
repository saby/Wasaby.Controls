define('js!SBIS3.CONTROLSs.Demo.MyTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyTextBox', 'css!SBIS3.CONTROLSs.Demo.MyTextBox', 'js!SBIS3.CONTROLS.TextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyTextBox
    * @class SBIS3.CONTROLSs.Demo.MyTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyTextBox.prototype */{
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