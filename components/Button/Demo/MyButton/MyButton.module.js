define('js!SBIS3.CONTROLS.Demo.MyButton',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MyButton',
     'Core/helpers/fast-control-helpers',
     'css!SBIS3.CONTROLS.Demo.MyButton',
     'js!SBIS3.CONTROLS.Button'],
    function(CompoundControl, dotTplFn, fcHelpers) {
   /**
    * SBIS3.CONTROLS.Demo.MyButton
    * @class SBIS3.CONTROLS.Demo.MyButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyButton.prototype */{
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
            fcHelpers.question("Может передумали?");
         });
      }
   });
   return moduleClass;
});