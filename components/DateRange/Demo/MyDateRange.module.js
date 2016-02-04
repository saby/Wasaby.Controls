define('js!SBIS3.CONTROLS.Demo.MyDateRange', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyDateRange',
   'js!SBIS3.CONTROLS.DateRange'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyDateRange
    * @class SBIS3.CONTROLS.Demo.MyDateRange
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyDateRange = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDateRange.prototype */{
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
});