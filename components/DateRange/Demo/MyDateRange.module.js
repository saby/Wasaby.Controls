define('js!SBIS3.CONTROLS.Demo.MyDateRange',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyDateRange',
      'js!SBIS3.CONTROLS.DateRange'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';
      var MyDateRange = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {}
         },

         $constructor: function () {
         },

         init: function () {
            MyDateRange.superclass.init.call(this);
         }
      });
      return MyDateRange;
   }
);