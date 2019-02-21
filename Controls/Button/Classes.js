define('Controls/Button/Classes', [
   'Controls/buttons',
   'Env/Env'
], function(buttonsLib, Env) {
   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Button/Classes',
      'This control is deprecated'
   );

   return buttonsLib.classesUtil;
});
