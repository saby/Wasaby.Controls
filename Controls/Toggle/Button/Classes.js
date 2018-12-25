define('Controls/Toggle/Button/Classes', ['Core/IoC'], function(IoC) {
   'use strict';
   var classesOfButton = {
      iconButtonBordered: {
         style: 'secondary',
         type: 'toolButton'
      },

      linkMain: {
         style: 'secondary',
         type: 'pushButton'
      },

      buttonLinkMain: {
         style: 'secondary',
         type: 'link'
      },

      buttonLinkAdditional: {
         style: 'info',
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
         var currentButtonClass = {};
         if (classesOfButton.hasOwnProperty(style)) {
            currentButtonClass.viewMode = classesOfButton[style].type;
            currentButtonClass.style = classesOfButton[style].style;
            IoC.resolve('ILogger').warn('Button', 'Используются устаревшие стили. Используйте опции: viewMode = ' + currentButtonClass.viewMode + ', style = ' + currentButtonClass.style);
         }
         return currentButtonClass;
      }
   };

   return Classes;
});
