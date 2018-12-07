define('Controls/List/ItemActions/Utils/getStyle', [
   'Core/IoC'
], function(
   IoC
) {
   'use strict';

   var deprecatedStyles = {
      error: 'danger',
      done: 'success',
      attention: 'warning',
      default: 'secondary'
   };

   return function getStyle(style, controlName) {
      if (!style) {
         return 'secondary';
      }

      if (deprecatedStyles.hasOwnProperty(style)) {
         IoC.resolve('ILogger').warn(controlName, 'Используются устаревшие стили. Используйте ' + deprecatedStyles[style] + ' вместо ' + style);
         return deprecatedStyles[style];
      }

      return style;
   };
});
