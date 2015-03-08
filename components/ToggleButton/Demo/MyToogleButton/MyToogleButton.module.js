define('js!SBIS3.Demo.Control.MyToggleButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyToggleButton', 'css!SBIS3.Demo.Control.MyToggleButton', 'js!SBIS3.CONTROLS.ToggleButton'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyToggleButton
    * @class SBIS3.Demo.Control.MyToggleButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyToggleButton.prototype */{
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