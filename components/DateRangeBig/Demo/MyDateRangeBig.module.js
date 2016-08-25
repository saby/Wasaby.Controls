define('js!SBIS3.CONTROLS.Demo.MyDateRangeBig', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyDateRangeBig',
   'js!SBIS3.CONTROLS.DateRangeBig'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyDateRangeBig
    * @class SBIS3.CONTROLS.Demo.MyDateRangeBig
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyDateRangeBig = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDateRangeBig.prototype */{
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
});