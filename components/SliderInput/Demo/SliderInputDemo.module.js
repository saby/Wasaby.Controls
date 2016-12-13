define('js!SBIS3.CONTROLS.Demo.SliderInputDemo',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.SliderInputDemo',
      'js!SBIS3.CONTROLS.SliderInput'
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