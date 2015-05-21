define('js!SBIS3.CONTROLS.Demo.MyMenuIcon',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MyMenuIcon',
     'css!SBIS3.CONTROLS.Demo.MyMenuIcon',
     'js!SBIS3.CONTROLS.MenuIcon'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyMenuIcon
    * @class SBIS3.CONTROLS.Demo.MyMenuIcon
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyMenuIcon.prototype */{
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