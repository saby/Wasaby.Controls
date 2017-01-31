define('js!SBIS3.CONTROLS.Demo.MyCheckbox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyCheckbox', 'css!SBIS3.CONTROLS.Demo.MyCheckbox', 'js!SBIS3.CONTROLS.CheckBox'], function(CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend({
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