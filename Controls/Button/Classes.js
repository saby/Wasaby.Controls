define('Controls/Button/Classes', ['Core/IoC'], function(IoC) {

   'use strict';
   var classesOfButton = {
      iconButtonBorderedAdditional: {
         style: 'iconButtonBordered',
         type: 'iconButtonBordered',
         outdated: true
      },

      iconButtonBordered: {
         style: 'iconButtonBordered',
         type: 'iconButtonBordered',
         transparent: true,
         outdated: true
      },

      linkMain: {
         style: 'link-main',
         type: 'link',
         outdated: true
      },
      linkMain2: {
         style: 'link-main2',
         type: 'link',
         outdated: true
      },
      linkMain3: {
         style: 'link-main3',
         type: 'link',
         outdated: true
      },
      linkAdditional: {
         style: 'link-additional',
         type: 'link',
         outdated: true
      },
      linkAdditional2: {
         style: 'link-additional2',
         type: 'link',
         outdated: true
      },

      linkAdditional3: {
         style: 'link-additional3',
         type: 'link',
         outdated: true
      },

      linkAdditional4: {
         style: 'link-additional4',
         type: 'link',
         outdated: true
      },

      linkAdditional5: {
         style: 'link-additional5',
         type: 'link',
         outdated: true
      },

      buttonPrimary: {
         style: 'primary',
         type: 'button',
         outdated: true
      },

      buttonDefault: {
         style: 'default',
         type: 'button',
         outdated: true
      },

      buttonAdd: {
         style: 'primary-add',
         type: 'button',
         outdated: true
      },

      primary: {
         style: 'newStyle',
         type: 'newType'
      },

      info: {
         style: 'newStyle',
         type: 'newType'
      },

      default: {
         style: 'newStyle',
         type: 'newType'
      },

      success: {
         style: 'newStyle',
         type: 'newType'
      },

      danger: {
         style: 'newStyle',
         type: 'newType'
      },

      warning: {
         style: 'newStyle',
         type: 'newType'
      },

      magic: {
         style: 'newStyle',
         type: 'newType'
      }
   };
   var Classes = {

      /**
     * Получить текущий стиль кнопки
     * @param {String} style
     * @returns {Object}
     */
      getCurrentButtonClass: function(style) {
         var currentButtonClass;
         if (classesOfButton.hasOwnProperty(style)) {
            IoC.resolve('ILogger').error('Button', 'Используются устаревшие стили кнопки. Используйте последнюю версию документации https://wi.sbis.ru/docs/js/Controls/Button/');
            currentButtonClass = classesOfButton[style];
         } else {
            IoC.resolve('ILogger').error('Button', 'Для кнопки задан несуществующий стиль');
            currentButtonClass = classesOfButton.buttonDefault;
         }

         return currentButtonClass;
      }

   };

   return Classes;
});
