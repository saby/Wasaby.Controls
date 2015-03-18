define('js!SBIS3.Demo.Control.MySwitcher', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MySwitcher', 'css!SBIS3.Demo.Control.MySwitcher', 'js!SBIS3.CONTROLS.Switcher'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MySwitcher
    * @class SBIS3.Demo.Control.MySwitcher
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MySwitcher.prototype */{
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