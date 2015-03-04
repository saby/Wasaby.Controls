define('js!SBIS3.Demo.Control.MyIconButton',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.Demo.Control.MyIconButton',
     'css!SBIS3.Demo.Control.MyIconButton',
     'js!SBIS3.CONTROLS.IconButton'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyIconButton
    * @class SBIS3.Demo.Control.MyIconButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyIconButton.prototype */{
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