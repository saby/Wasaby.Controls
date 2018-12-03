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
          * Base template of confirm dialog.
          * @class Controls/Popup/Templates/Dialog/ConfirmationTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/Popup/Templates/Dialog/ConfirmationTmplStyles
          */

         /**
          * @name Controls/Popup/Opener/Confirmation/Dialog#size
          * @cfg {String} Option description.
          * @variant default По умоланию
          * @variant success Успех
          * @variant error Ошибка
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#style
          * @cfg {String} Option description.
          * @variant default Default
          * @variant success Success
          * @variant error Error
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#contentArea
          * @cfg {Content} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#footerArea
          * @cfg {Content} Content at the bottom of the confirm panel.
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
