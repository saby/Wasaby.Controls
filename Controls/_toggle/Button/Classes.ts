import {Logger} from 'UI/Utils';
import {Control} from 'UI/Base';

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
   getCurrentButtonClass(style: string, self: Control): ICurrentButtonClass {
      const currentButtonClass: ICurrentButtonClass = {};
      if (classesOfButton.hasOwnProperty(style)) {
         currentButtonClass.viewMode = classesOfButton[style].type;
         currentButtonClass.style = classesOfButton[style].style;
         Logger
            .warn('Button: Используются устаревшие стили. Используйте опции: viewMode = ' + currentButtonClass.viewMode + ', style = ' + currentButtonClass.style, self);
      }
      return currentButtonClass;
   }
};

export default Classes;
