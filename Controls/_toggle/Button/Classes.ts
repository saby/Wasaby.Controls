import Env = require('Env/Env');

const classesOfButton = {
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
interface ICurrentButtonClass {
   viewMode?: string;
   style?: string;
}

const Classes = {
   /**
    * Получить текущий стиль кнопки
    * @param {String} style
    * @returns {Object}
    */
   getCurrentButtonClass(style: string): ICurrentButtonClass {
      const currentButtonClass: ICurrentButtonClass = {};
      if (classesOfButton.hasOwnProperty(style)) {
         currentButtonClass.viewMode = classesOfButton[style].type;
         currentButtonClass.style = classesOfButton[style].style;
         Env.IoC.resolve('ILogger')
            .warn('Button','Используются устаревшие стили. Используйте опции: viewMode = ' + currentButtonClass.viewMode + ', style = ' + currentButtonClass.style);
      }
      return currentButtonClass;
   }
};

export default Classes;
