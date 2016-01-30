define('js!SBIS3.CONTROLS.Demo.MyMenuIconNew',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MyMenuIconNew',
     'css!SBIS3.CONTROLS.Demo.MyMenuIconNew',
     'js!SBIS3.CONTROLS.MenuIconNew'],
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