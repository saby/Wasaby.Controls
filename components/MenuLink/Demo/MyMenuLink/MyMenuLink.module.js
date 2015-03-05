define('js!SBIS3.Demo.Control.MyMenuLink',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.Demo.Control.MyMenuLink',
     'css!SBIS3.Demo.Control.MyMenuLink',
     'js!SBIS3.CONTROLS.MenuLink'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyMenuLink
    * @class SBIS3.Demo.Control.MyMenuLink
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyMenuLink.prototype */{
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