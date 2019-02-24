define('Controls/Date/Month', [
   'Controls/calendar',
   'Env/Env'
], function(
   calendarLib,
   Env
) {

   'use strict';

   /**
    * Календарь отображающий 1 месяц.
    * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора периода с помощью мыши.
    * 
    * @class Controls/Date/Month
    * @extends Core/Control
    * @mixes Controls/_calendar/interfaces/IMonth
    * @mixes Controls/Date/interface/IRangeSelectable
    * @mixes Controls/Date/interface/IDateRangeSelectable
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Date/Month
    *
    */

   Env.IoC.resolve('ILogger').error(
      'Controls/Date/Month' +
      'This control is deprecated. Use \'Controls/calendar:Month\' instead'
   );

   return calendarLib.Month;
});
