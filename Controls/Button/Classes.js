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
         }
         return currentButtonClass;
      }

   };

   return Classes;
});
