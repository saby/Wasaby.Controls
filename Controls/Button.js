define('Controls/Button', [
   'Controls/buttons',
   'Env/Env'
], function(buttonsLib, Env) {
   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Button',
      'This control is deprecated. Use \'Controls/buttons:Button\' instead'
   );

   return buttonsLib.Button;
});
