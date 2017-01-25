define('js!SBIS3.CONTROLS.Demo.MyDateRangeSliderBig', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyDateRangeSliderBig',
   'js!SBIS3.CONTROLS.DateRangeSliderBig'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyDateRangeSliderBig
    * @class SBIS3.CONTROLS.Demo.MyDateRangeSliderBig
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyDateRangeSliderBig = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDateRangeBig.prototype */{
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
});