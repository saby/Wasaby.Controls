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
      },
      iconColorFromOptIconToIconStyle: function(icon) {
         var
            iconStyleFromIconOpt = /icon-[eadhp][a-z]+/.exec(icon),
            newIconStyle = '';
         if (iconStyleFromIconOpt) {
            newIconStyle = iconStyleFromIconOpt[0].replace('icon-', '');

            // не будем возвращать primary так как он эквивалентен secondary, который будет по умолчанию. этим избавляемся
            // от коллизии с тем что iconStyle primary есть и в старом варианте и в новом, но их значения не эквивалентны
            return (newIconStyle === 'primary' ? '' : newIconStyle);
         }
         return '';
      },
      itemsSetOldIconStyle: function(items) {
         items.forEach(function(item) {
            if (item.get('icon') && !item.get('iconStyle')) {
               var newIconStyle = iconStyleValidate.iconColorFromOptIconToIconStyle(item.get('icon'));
               if (newIconStyle) {
                  item.set('iconStyle', newIconStyle);
               }
            }
         });
      }
   };

   return iconStyleValidate;
});
