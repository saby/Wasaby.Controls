define('js!SBIS3.DemoCode.MyMenuButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.DemoCode.MyMenuButton', 'css!SBIS3.DemoCode.MyMenuButton', 'js!SBIS3.CONTROLS.MenuButton', 'js!SBIS3.CONTROLS.MenuLink'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.DemoCode.MyMenuButton
    * @class SBIS3.DemoCode.MyMenuButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.MyMenuButton.prototype */{
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