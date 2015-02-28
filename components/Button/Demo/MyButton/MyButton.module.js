define('js!SBIS3.DemoCode.MyButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.DemoCode.MyButton', 'css!SBIS3.DemoCode.MyButton', 'js!SBIS3.CONTROLS.Button'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.DemoCode.MyButton
    * @class SBIS3.DemoCode.MyButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.MyButton.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         this.getChildControlByName("Button 1").subscribe("onActivated", function() {
            $ws.helpers.question("Может передумали?"); 
         });
      }
   });
   return moduleClass;
});