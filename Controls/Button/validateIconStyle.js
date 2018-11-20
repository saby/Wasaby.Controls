define('Controls/Button/validateIconStyle', ['Core/IoC'], function(IoC) {

   'use strict';

   var iconStyleValidate = {

      /**
       * Перевести iconStyle из старых обозначений в новые.
       * @param {String} iconStyle
       * @returns {Object}
       */
      iconStyleTransformation: function(iconStyle) {
         var newIconStyle;
         switch (iconStyle) {
            case 'default':
               newIconStyle = 'secondary';
               IoC.resolve('ILogger').warn('Button', 'Используется устаревшее значение опции iconStyle. Используйте значение secondary вместо default');
               break;
            case 'attention':
               newIconStyle = 'warning';
               IoC.resolve('ILogger').warn('Button', 'Используется устаревшее значение опции iconStyle. Используйте значение warning вместо attention');
               break;
            case 'done':
               newIconStyle = 'success';
               IoC.resolve('ILogger').warn('Button', 'Используется устаревшее значение опции iconStyle. Используйте значение success виесто done');
               break;
            case 'error':
               newIconStyle = 'danger';
               IoC.resolve('ILogger').warn('Button', 'Используется устаревшее значение опции iconStyle. Используйте значение danger вместо error');
               break;
            default:
               newIconStyle = iconStyle;
               break;
         }
         return newIconStyle;
      }

   };

   return iconStyleValidate;
});
