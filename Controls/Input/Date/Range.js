define('Controls/Input/Date/Range', [
   'Controls/dateRange'/*,
   'Env/Env:IoC'*/
], function(
   dateRangeLib/*,
   IoC*/
) {
   'use strict';


   /*IoC.resolve('ILogger').error(
      'Controls/Input/Date/Range' +
      'This control is deprecated. Use \'Controls/dateRange:Input\' instead'
   );*/

   return dateRangeLib.Input;
});
