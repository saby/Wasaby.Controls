define('js!SBIS3.DemoCode.MyMenuIcon', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.DemoCode.MyMenuIcon', 'css!SBIS3.DemoCode.MyMenuIcon', 'js!SBIS3.CONTROLS.MenuIcon'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.DemoCode.MyMenuIcon
    * @class SBIS3.DemoCode.MyMenuIcon
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.MyMenuIcon.prototype */{
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