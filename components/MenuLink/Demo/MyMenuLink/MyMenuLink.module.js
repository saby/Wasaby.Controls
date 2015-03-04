define('js!SBIS3.DemoCode.MyMenuLink',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.DemoCode.MyMenuLink',
     'css!SBIS3.DemoCode.MyMenuLink',
     'js!SBIS3.CONTROLS.MenuLink'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.DemoCode.MyMenuLink
    * @class SBIS3.DemoCode.MyMenuLink
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.MyMenuLink.prototype */{
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