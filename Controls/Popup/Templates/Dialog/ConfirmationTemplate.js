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
          */

         /**
          * @name Controls/Popup/Opener/Confirmation/Dialog#size
          * @cfg {String} Option description.
          * @variant default Default size
          * @variant big Big Size
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
          * @default false
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#contentArea
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#footerArea
          * @cfg {function|String} Content at the bottom of the confirm panel.
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
