define('Controls/Date/MonthList', [
   'Controls/calendar',
   'Env/Env'
], function(
   calendarLib,
   Env
) {
   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Date/MonthList' +
      'This control is deprecated. Use \'Controls/calendar:MonthList\' instead'
   );

   return calendarLib.MonthList;
});
