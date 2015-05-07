define('js!SBIS3.CONTROLSs.Demo.MySwitcher', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MySwitcher', 'css!SBIS3.CONTROLSs.Demo.MySwitcher', 'js!SBIS3.CONTROLS.Switcher'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MySwitcher
    * @class SBIS3.CONTROLSs.Demo.MySwitcher
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MySwitcher.prototype */{
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