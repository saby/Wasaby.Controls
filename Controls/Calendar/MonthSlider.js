define('Controls/Calendar/MonthSlider', [
   'Controls/calendar',
   'Env/Env'
], function(
   calendarLib,
   Env
) {

   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Date/MonthSlider' +
      'This control is deprecated. Use \'Controls/calendar:MonthSlider\' instead'
   );

   return calendarLib.MonthSlider;
});
