define('js!SBIS3.CONTROLS.Demo.MyDateRangeChoose',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyDateRangeChoose',
      'css!SBIS3.CONTROLS.Demo.MyDateRangeChoose',
      'js!SBIS3.CONTROLS.DateRangeChoose'
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