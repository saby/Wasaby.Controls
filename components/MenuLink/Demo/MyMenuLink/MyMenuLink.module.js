define('js!SBIS3.CONTROLSs.Demo.MyMenuLink',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLSs.Demo.MyMenuLink',
     'css!SBIS3.CONTROLSs.Demo.MyMenuLink',
     'js!SBIS3.CONTROLS.MenuLink'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyMenuLink
    * @class SBIS3.CONTROLSs.Demo.MyMenuLink
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyMenuLink.prototype */{
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