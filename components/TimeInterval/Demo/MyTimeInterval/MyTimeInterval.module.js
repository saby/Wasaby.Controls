define('js!SBIS3.CONTROLS.Demo.MyTimeInterval', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyTimeInterval', 'css!SBIS3.CONTROLS.Demo.MyTimeInterval', 'js!SBIS3.CONTROLS.TimeInterval'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyTimeInterval
    * @class SBIS3.CONTROLS.Demo.MyTimeInterval
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTimeInterval.prototype */{
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