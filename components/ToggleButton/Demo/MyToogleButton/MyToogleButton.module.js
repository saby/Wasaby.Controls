define('js!SBIS3.CONTROLS.Demo.MyToggleButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyToggleButton', 'css!SBIS3.CONTROLS.Demo.MyToggleButton', 'js!SBIS3.CONTROLS.ToggleButton'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyToggleButton
    * @class SBIS3.CONTROLS.Demo.MyToggleButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyToggleButton.prototype */{
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