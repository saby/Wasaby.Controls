import { IoC } from 'Env/Env';

const deprecatedClassesOfButton = {
   iconButtonBordered: {
      style: 'secondary',
      type: 'toolButton'
   },

   linkMain: {
      style: 'secondary',
      type: 'link'
   },
   linkMain2: {
      style: 'info',
      type: 'link'
   },
   linkMain3: {
      style: 'info',
      type: 'link'
   },
   linkAdditional: {
      style: 'info',
      type: 'link'
   },
   linkAdditional2: {
      style: 'default',
      type: 'link'
   },

   linkAdditional3: {
      style: 'danger',
      type: 'link'
   },

   linkAdditional4: {
      style: 'success',
      type: 'link'
   },

   linkAdditional5: {
      style: 'magic',
      type: 'link'
   },

   buttonPrimary: {
      style: 'primary',
      type: 'button'
   },

   buttonDefault: {
      style: 'secondary',
      type: 'button'
   },

   buttonAdd: {
      style: 'primary',
      type: 'button'
   }
};

interface IButtonClass {
   viewMode: string;
   style: string;
   buttonAdd: boolean;
}

const ActualApi = {
   /**
    * Получить текущий стиль кнопки
    * @param {String} style
    * @returns {ButtonClass}
    */
   styleToViewMode(style: string): IButtonClass {
      const currentButtonClass: IButtonClass = {
         viewMode: '',
         style: '',
         buttonAdd: false
      };
      if (deprecatedClassesOfButton.hasOwnProperty(style)) {
         currentButtonClass.viewMode = deprecatedClassesOfButton[style].type;
         currentButtonClass.style = deprecatedClassesOfButton[style].style;
         if (style === 'linkMain2' || style === 'linkMain3') {
            IoC.resolve('ILogger').warn('Button', 'Используются устаревшие стили. Используйте компонент Controls/Label c опцией underline: hovered и fixed');
         } else if (style === 'buttonAdd') {
            currentButtonClass.buttonAdd = true;
            IoC.resolve('ILogger').warn('Button', 'Используются устаревшие стили. Используйте опцию iconStyle в различных значениях для изменения по наведению');
         } else {
            IoC.resolve('ILogger').warn('Button', 'Используются устаревшие стили. Используйте опции: viewMode = ' + currentButtonClass.viewMode + ', style = ' + currentButtonClass.style);
         }
      }
      return currentButtonClass;
   },
   /**
    * Перевести iconStyle из старых обозначений в новые.
    * @param {String} iconStyle
    * @returns {Object}
    */
   iconStyleTransformation: function (iconStyle) {
      let newIconStyle;
      switch (iconStyle) {
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
   },
   contrastBackground(options): boolean {
      if (typeof options.contrastBackground !== undefined) {
         return options.contrastBackground;
      } else {
         return !options.transparent;
      }
   }
};
export default ActualApi;
