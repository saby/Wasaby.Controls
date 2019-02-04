define('Controls/Button/Classes', [
   'Controls/buttons',
   'Core/IoC'
], function(buttonsLib, IoC) {
   'use strict';

   IoC.resolve('ILogger').error(
      'Controls/Button/Classes',
      'This control is deprecated'
   );

   return buttonsLib.classesUtil;
});
