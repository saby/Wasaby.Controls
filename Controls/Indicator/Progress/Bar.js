define('Controls/Indicator/Progress/Bar', [
   'Controls/progress',
   'Env/Env'
], function(progressLib, Env) {
   'use strict';

   

   Env.IoC.resolve('ILogger').error(
      'Controls/Indicator/Progress/Bar',
      'This control is deprecated. Use \'Controls/progress:Bar\' instead'
   );

   return progressLib.Bar;
});
