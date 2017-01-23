/*global define*/
define('js!SBIS3.CONTROLS.DateRangeBig', [
   'js!SBIS3.CONTROLS.DateRange',
   'js!SBIS3.CONTROLS.DateRangeBigChoose',
   'css!SBIS3.CONTROLS.DateRangeBig'
], function (DateRange, DateRangeBigChoose) {
   'use strict';
   /**
    * SBIS3.CONTROLS.DateRangeBig
    * @class SBIS3.CONTROLS.DateRangeBig
    * @extends SBIS3.CONTROLS.DateRange
    * @author Миронов Александр Юрьевич
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDateRangeBig
    */
   var DateRangeBig = DateRange.extend( /** @lends SBIS3.CONTROLS.DateRangeBig.prototype */{
      $protected: {
         _chooseControlClass: DateRangeBigChoose
      }
   });
   return DateRangeBig;
});
