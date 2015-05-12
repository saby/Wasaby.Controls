define('js!SBIS3.CONTROLS.Demo.MyMenuButton',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MyMenuButton',
     'css!SBIS3.CONTROLS.Demo.MyMenuButton',
     'js!SBIS3.CONTROLS.MenuButton',
     'js!SBIS3.CONTROLS.MenuLink'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyMenuButton
    * @class SBIS3.CONTROLS.Demo.MyMenuButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyMenuButton.prototype */{
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