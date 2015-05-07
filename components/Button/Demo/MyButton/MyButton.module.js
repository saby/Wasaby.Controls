define('js!SBIS3.CONTROLSs.Demo.MyButton',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLSs.Demo.MyButton',
     'css!SBIS3.CONTROLSs.Demo.MyButton',
     'js!SBIS3.CONTROLS.Button'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyButton
    * @class SBIS3.CONTROLSs.Demo.MyButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyButton.prototype */{
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