define('js!SBIS3.Controls.Demo.MyToggleButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MyToggleButton', 'css!SBIS3.Controls.Demo.MyToggleButton', 'js!SBIS3.CONTROLS.ToggleButton'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyToggleButton
    * @class SBIS3.Controls.Demo.MyToggleButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyToggleButton.prototype */{
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