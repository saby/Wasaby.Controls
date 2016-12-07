/*global define*/
define('js!SBIS3.CONTROLS.DateRangeSliderBig', [
   'js!SBIS3.CONTROLS.DateRangeSliderBase',
   'js!SBIS3.CONTROLS.DateRangeBigChoosePickerMixin'
], function (DateRangeSliderBase, DateRangeBigChoosePickerMixin) {
   'use strict';
   /**
    * Контрол позволяющий выбирать произвольный диапазон дат.
    * SBIS3.CONTROLS.DateRangeSliderBig
    * @class SBIS3.CONTROLS.DateRangeSliderBig
    * @extends SBIS3.CONTROLS.DateRangeSliderBase
    * @mixes SBIS3.CONTROLS.DateRangeBigChoosePickerMixin
    * @author Миронов Александр Юрьевич
    *
    * @control
    * @public
    * @category Date/Time
    * @demo SBIS3.CONTROLS.Demo.MyDateRangeSliderBig
    */
   var DateRangeSliderBig = DateRangeSliderBase.extend([DateRangeBigChoosePickerMixin], /** @lends SBIS3.CONTROLS.DateRangeSliderBig.prototype */{
   });
   return DateRangeSliderBig;
});
