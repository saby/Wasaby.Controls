define('js!SBIS3.CONTROLS.Demo.MyDateRangeSliderBig',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyDateRangeSliderBig',
      'js!SBIS3.CONTROLS.DateRangeSliderBig'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';
      var MyDateRangeSliderBig = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {}
         },
         $constructor: function () {
         },

         init: function () {
            MyDateRangeSliderBig.superclass.init.call(this);
         }
      });
      return MyDateRangeSliderBig;
   }
);