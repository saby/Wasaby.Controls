define('Controls/Button/validateIconStyle', [
   'Controls/buttons',
   'Env/Env'
], function(buttonsLib, Env) {
   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Button/validateIconStyle',
      'This control is deprecated'
   );

   return buttonsLib.iconsUtil;
});
