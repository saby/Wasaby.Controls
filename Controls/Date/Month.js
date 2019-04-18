define('Controls/Date/Month', [
   'Controls/calendar',
   'Env/Env'
], function(
   calendarLib,
   Env
) {

   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Date/Month' +
      'This control is deprecated. Use \'Controls/calendar:Month\' instead'
   );

   return calendarLib.Month;
});
