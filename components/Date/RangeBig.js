/*global define*/
define('SBIS3.CONTROLS/Date/RangeBig', [
   'SBIS3.CONTROLS/Date/Range',
   'css!SBIS3.CONTROLS/Date/RangeBig/DateRangeBig'
], function (DateRange) {
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
    * @deprecated Используйте {@link SBIS3.CONTROLS/Date/Range}
    *
    * @demo Examples/DateRangeBig/MyDateRangeBig/MyDateRangeBig
    */
   var DateRangeBig = DateRange.extend( /** @lends SBIS3.CONTROLS/Date/RangeBig.prototype */{
   });
   return DateRangeBig;
});
