define('js!SBIS3.Demo.Control.MyFormattedTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyFormattedTextBox', 'css!SBIS3.Demo.Control.MyFormattedTextBox', 'js!SBIS3.CONTROLS.FormattedTextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyFormattedTextBox
    * @class SBIS3.Demo.Control.MyFormattedTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyFormattedTextBox.prototype */{
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