import * as IoC from 'Core/IoC';

export default {

   /**
    * Перевести iconStyle из старых обозначений в новые.
    * @param {String} iconStyle
    * @returns {Object}
    */
   iconStyleTransformation: function (iconStyle) {
      let newIconStyle;
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

   // TODO: убрать когда полностью откажемся от поддержки задавания цвета в опции иконки. icon: icon-error, icon-done и т.д.
   // TODO: https://online.sbis.ru/opendoc.html?guid=05bbeb41-d353-4675-9f73-6bfc654a5f00
   iconColorFromOptIconToIconStyle: function (icon) {
      const iconStyleFromIconOpt = /icon-[eadhp][a-z]+/.exec(icon);
      let newIconStyle = '';
      if (iconStyleFromIconOpt) {
         newIconStyle = iconStyleFromIconOpt[0].replace('icon-', '');

         // не будем возвращать primary так как он эквивалентен secondary, который будет по умолчанию. этим избавляемся
         // от коллизии с тем что iconStyle primary есть и в старом варианте и в новом, но их значения не эквивалентны
         return (newIconStyle === 'primary' ? '' : newIconStyle);
      }
      return '';
   },
   itemsSetOldIconStyle: function (items) {
      items.forEach((item) => {
         if (item.get('icon') && !item.get('iconStyle')) {
            const newIconStyle = this.iconColorFromOptIconToIconStyle(item.get('icon'));
            if (newIconStyle) {
               item.set('iconStyle', newIconStyle);
            }
         }
      });
   }
};
