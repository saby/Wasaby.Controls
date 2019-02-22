define('Controls/Calendar/MonthSlider', [
   'Controls/calendar',
   'Env/Env'
], function(
   calendarLib,
   Env
) {

   'use strict';

   /**
    * A calendar that displays 1 month and allows you to switch to the next and previous months using the buttons.
    * Designed to select a date or period within a few months or years.
    *
    * @class Controls/Calendar/MonthSlider
    * @extends Core/Control
    * @mixes Controls/_calendar/interfaces/IMonth
    * @mixes Controls/Date/interface/IRangeSelectable
    * @mixes Controls/Date/interface/IDateRangeSelectable
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Calendar/MonthSlider
    *
    */

   Env.IoC.resolve('ILogger').error(
      'Controls/Date/MonthSlider' +
      'This control is deprecated. Use \'Controls/calendar:MonthSlider\' instead'
   );

   return calendarLib.MonthSlider;
});
