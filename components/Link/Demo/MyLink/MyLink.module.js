define('js!SBIS3.Demo.Control.MyLink', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyLink', 'css!SBIS3.Demo.Control.MyLink', 'js!SBIS3.CONTROLS.Link'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyLink
    * @class SBIS3.Demo.Control.MyLink
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyLink.prototype */{
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