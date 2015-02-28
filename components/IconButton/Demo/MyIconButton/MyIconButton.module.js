define('js!SBIS3.DemoCode.MyIconButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.DemoCode.MyIconButton', 'css!SBIS3.DemoCode.MyIconButton', 'js!SBIS3.CONTROLS.IconButton'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.DemoCode.MyIconButton
    * @class SBIS3.DemoCode.MyIconButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.MyIconButton.prototype */{
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
            $ws.helpers.question("Действительно хотите в отпуск?"); 
         });
      }
   });
   return moduleClass;
});