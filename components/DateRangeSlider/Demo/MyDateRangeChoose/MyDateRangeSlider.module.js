define('js!SBIS3.CONTROLS.Demo.MyDateRangeSlider',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyDateRangeSlider',
      'css!SBIS3.CONTROLS.Demo.MyDateRangeSlider',
      'js!SBIS3.CONTROLS.DateRangeSlider'
   ],
   function(CompoundControl, dotTplFn) {
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
   }
);