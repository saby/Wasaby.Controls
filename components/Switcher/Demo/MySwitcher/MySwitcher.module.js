define('js!SBIS3.Controls.Demo.MySwitcher', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MySwitcher', 'css!SBIS3.Controls.Demo.MySwitcher', 'js!SBIS3.CONTROLS.Switcher'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MySwitcher
    * @class SBIS3.Controls.Demo.MySwitcher
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MySwitcher.prototype */{
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