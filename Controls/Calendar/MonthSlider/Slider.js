define('Controls/Calendar/MonthSlider/Slider', [
   'Controls/calendar'
], function(
   calendarLib
) {

   'use strict';

   /**
    * A calendar that displays 1 month and allows you to switch to the next and previous months using the buttons.
    * Designed to select a date or period within a few months or years.
    *
    * @class Controls/calendar:MonthSlider
    * @extends Core/Control
    * @mixes Controls/_calendar/interfaces/IMonth
    * @mixes Controls/Date/interface/IRangeSelectable
    * @mixes Controls/_dateRange/interfaces/IDateRangeSelectable
    * @control
    * @private
    * @author Миронов А.Ю.
    * @demo Controls-demo/Calendar/MonthSlider
    *
    */

   return calendarLib.MonthSliderBase;
});
