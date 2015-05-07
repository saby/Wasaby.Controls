define('js!SBIS3.CONTROLSs.Demo.MyToggleButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MyToggleButton', 'css!SBIS3.CONTROLSs.Demo.MyToggleButton', 'js!SBIS3.CONTROLS.ToggleButton'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyToggleButton
    * @class SBIS3.CONTROLSs.Demo.MyToggleButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyToggleButton.prototype */{
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