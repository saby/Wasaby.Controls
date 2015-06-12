define('js!SBIS3.CONTROLS.Demo.MyTextArea', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyTextArea', 'css!SBIS3.CONTROLS.Demo.MyTextArea', 'js!SBIS3.CONTROLS.TextArea'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyTextArea
    * @class SBIS3.CONTROLS.Demo.MyTextArea
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTextArea.prototype */{
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