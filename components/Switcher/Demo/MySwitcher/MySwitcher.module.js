define('js!SBIS3.CONTROLS.Demo.MySwitcher', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MySwitcher', 'css!SBIS3.CONTROLS.Demo.MySwitcher', 'js!SBIS3.CONTROLS.Switcher'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MySwitcher
    * @class SBIS3.CONTROLS.Demo.MySwitcher
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySwitcher.prototype */{
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