define('js!SBIS3.CONTROLS.Demo.MyDateRangeBig',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyDateRangeBig',
      'js!SBIS3.CONTROLS.DateRangeBig'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';
      var MyDateRangeBig = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {}
         },
         $constructor: function () {
         },

         init: function () {
            MyDateRangeBig.superclass.init.call(this);
         }
      });
      return MyDateRangeBig;
   }
);