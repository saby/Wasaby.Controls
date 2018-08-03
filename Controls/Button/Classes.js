define('Controls/Button/Classes', ['Core/IoC'], function(IoC) {

   'use strict';
   var classesOfButton = {
      iconButtonBorderedAdditional: {
         style: 'iconButtonBordered',
         type: 'iconButtonBordered'
      },

      iconButtonBordered: {
         style: 'iconButtonBordered',
         type: 'iconButtonBordered',
         transparent: true
      },

      linkMain: {
         style: 'link-main',
         type: 'link'
      },
      linkMain2: {
         style: 'link-main2',
         type: 'link'
      },
      linkMain3: {
         style: 'link-main3',
         type: 'link'
      },
      linkAdditional: {
         style: 'link-additional',
         type: 'link'
      },
      linkAdditional2: {
         style: 'link-additional2',
         type: 'link'
      },

      linkAdditional3: {
         style: 'link-additional3',
         type: 'link'
      },

      linkAdditional4: {
         style: 'link-additional4',
         type: 'link'
      },

      linkAdditional5: {
         style: 'link-additional5',
         type: 'link'
      },

      buttonPrimary: {
         style: 'primary',
         type: 'button'
      },

      buttonDefault: {
         style: 'default',
         type: 'button'
      },

      buttonAdd: {
         style: 'primary-add',
         type: 'button'
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
            currentButtonClass = classesOfButton[style];
         } else {
            IoC.resolve('ILogger').error('Button', 'Для кнопки задан несуществующий стиль');
            currentButtonClass = classesOfButton.buttonDefault;
         }
         return currentButtonClass;
      }

   };

   return Classes;
}
);
