define('Controls/Button/validateIconStyle', [
   'Controls/buttons',
   'Core/IoC'
], function(buttonsLib, IoC) {
   'use strict';

   IoC.resolve('ILogger').error(
      'Controls/Button/validateIconStyle',
      'This control is deprecated'
   );

   return buttonsLib.iconsUtil;
});
