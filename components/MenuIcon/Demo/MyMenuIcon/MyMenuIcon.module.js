define('js!SBIS3.CONTROLSs.Demo.MyMenuIcon',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLSs.Demo.MyMenuIcon',
     'css!SBIS3.CONTROLSs.Demo.MyMenuIcon',
     'js!SBIS3.CONTROLS.MenuIcon'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyMenuIcon
    * @class SBIS3.CONTROLSs.Demo.MyMenuIcon
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyMenuIcon.prototype */{
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