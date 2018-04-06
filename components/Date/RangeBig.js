/*global define*/
define('SBIS3.CONTROLS/Date/RangeBig', [
   'SBIS3.CONTROLS/Date/Range',
   'SBIS3.CONTROLS/Date/RangeBigChoose',
   'css!SBIS3.CONTROLS/Date/RangeBig/DateRangeBig'
], function (DateRange, DateRangeBigChoose) {
   'use strict';
   /**
    * SBIS3.CONTROLS/Date/RangeBig
    * @class SBIS3.CONTROLS/Date/RangeBig
    * @extends SBIS3.CONTROLS/Date/Range
    *
    * @author Миронов А.Ю.
    *
    * @control
    * @public
    *
    * @demo Examples/DateRangeBig/MyDateRangeBig/MyDateRangeBig
    */
   var DateRangeBig = DateRange.extend( /** @lends SBIS3.CONTROLS/Date/RangeBig.prototype */{
      $protected: {
         _chooseControlClass: DateRangeBigChoose
      }
   });
   return DateRangeBig;
});
