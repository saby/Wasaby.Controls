define('Controls/Date/MonthList', [
   'Controls/calendar',
   'Core/IoC'
], function(
   calendarLib,
   IoC
) {
   'use strict';

   /**
    * Прокручивающийся список с месяцами. Позволяет выбирать период.
    *
    * @class Controls/Date/MonthList
    * @mixes Controls/Date/interface/IMonthListCustomDays
    * @extends Core/Control
    * @author Миронов А.Ю.
    * @noShow
    */

   IoC.resolve('ILogger').error(
      'Controls/Date/MonthList' +
      'This control is deprecated. Use \'Controls/calendar:MonthList\' instead'
   );

   return calendarLib.MonthList;
});
