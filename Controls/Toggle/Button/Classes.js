define('Controls/Toggle/Button/Classes', ['Core/IoC'], function(IoC) {
   'use strict';
   var classesOfButton = {
      iconButtonBordered: {
         style: 'iconButtonBordered',
         type: 'iconButtonBordered'
      },

      linkMain: {
         style: 'link-main_toggled',
         type: 'link_toggled'
      },

      buttonLinkMain: {
         style: 'link-main',
         type: 'link'
      },

      buttonLinkAdditional: {
         style: 'link-additional',
         type: 'link'
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
            IoC.resolve('ILogger').error('ToggleButton', 'Для кнопки задан несуществующий стиль');
            currentButtonClass = classesOfButton.buttonDefault;
         }
         return currentButtonClass;
      }
   };

   return Classes;
});
