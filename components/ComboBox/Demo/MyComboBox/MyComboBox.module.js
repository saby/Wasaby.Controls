define('js!SBIS3.CONTROLS.Demo.MyComboBox',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyComboBox',
      'css!SBIS3.CONTROLS.Demo.MyComboBox',
      'js!SBIS3.CONTROLS.ComboBox'
   ],
   function(CompoundControl, dotTplFn) {
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         init: function() {
            moduleClass.superclass.init.call(this);
         }
      });
      return moduleClass;
   }
);