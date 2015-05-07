define('js!SBIS3.CONTROLSs.Demo.MyMenuButton',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLSs.Demo.MyMenuButton',
     'css!SBIS3.CONTROLSs.Demo.MyMenuButton',
     'js!SBIS3.CONTROLS.MenuButton',
     'js!SBIS3.CONTROLS.MenuLink'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyMenuButton
    * @class SBIS3.CONTROLSs.Demo.MyMenuButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyMenuButton.prototype */{
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