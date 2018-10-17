define('Controls/Popup/Templates/Dialog/ConfirmationTemplate',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Dialog/ConfirmationTemplate',
      'css!theme?Controls/Popup/Templates/Dialog/ConfirmationTemplate'
   ],
   function(Control, template) {
      'use strict';

      var DialogTemplate = Control.extend({

         /**
          * Базовый шаблон диалога
          * @class Controls/Popup/Templates/Dialog/ConfirmationTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников Андрей
          */

         /**
          * @name Controls/Popup/Opener/Confirmation/Dialog#style
          * @cfg {String} Стилевое оформление диалога
          * @variant default По умоланию
          * @variant success Успех
          * @variant error Ошибка
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#style
          * @cfg {String} Style of dialog
          * @variant default Default
          * @variant success Success
          * @variant error Error
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#hideCross
          * @cfg {String} Don't show cross
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#mainArea
          * @cfg {Content} Content of main area.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#footerArea
          * @cfg {Content} Content of footer area.
          */

         _template: template,

         /**
          * Close the dialog
          * @function Controls/Popup/Templates/Dialog/ConfirmationTemplate#close
          */
         close: function() {
            this._notify('close', [], {bubbling: true});
         }
      });
      return DialogTemplate;
   }
);
