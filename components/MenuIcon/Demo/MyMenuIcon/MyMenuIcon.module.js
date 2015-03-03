define('js!SBIS3.Demo.Control.MyMenuIcon', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyMenuIcon', 'css!SBIS3.Demo.Control.MyMenuIcon', 'js!SBIS3.CONTROLS.MenuIcon'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyMenuIcon
    * @class SBIS3.Demo.Control.MyMenuIcon
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyMenuIcon.prototype */{
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