define('js!SBIS3.Demo.Control.MyMenuButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyMenuButton', 'css!SBIS3.Demo.Control.MyMenuButton', 'js!SBIS3.CONTROLS.MenuButton', 'js!SBIS3.CONTROLS.MenuLink'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyMenuButton
    * @class SBIS3.Demo.Control.MyMenuButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyMenuButton.prototype */{
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