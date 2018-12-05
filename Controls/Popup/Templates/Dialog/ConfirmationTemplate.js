define('Controls/Popup/Templates/Dialog/ConfirmationTemplate',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Dialog/ConfirmationTemplate',
      'Core/IoC',
      'css!theme?Controls/Popup/Templates/Dialog/ConfirmationTemplate'
   ],
   function(Control, template, IoC) {
      'use strict';

      var _private = {
         prepareStatusStyle: function(color) {
            var resColor = color;
            // поддержка старых цветов, чтоб не ломать старые
            if (color === 'error') {
               resColor = 'danger';
            }
            return resColor;
         }
      };

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
          * @variant default Default size
          * @variant big Big Size
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#style
          * @cfg {String} Option description.
          * @variant default Default
          * @variant success Success
          * @variant danger Danger
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          * @default false
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the confirm panel.
          */

         _template: template,
         _beforeMount: function(options) {
            if (options.style === 'error') {
               IoC.resolve('ILogger').error('ConfirmationTemplate', 'Используется устаревшее значение опции style - error, используйте danger');
            }
            options._style = _private.prepareStatusStyle(options.style);
            if (options.contentArea) {
               IoC.resolve('ILogger').error('ConfirmationTemplate', 'Используется устаревшая опция contentArea, используйте bodyContentTemplate');
            }
            if (options.footerArea) {
               IoC.resolve('ILogger').error('ConfirmationTemplate', 'Используется устаревшая опция footerArea, используйте footerContentTemplate');
            }
         },
         _beforeUpdate: function(options) {
            options._style = _private.prepareStatusStyle(options.style);
         },

         /**
          * Close the dialog
          * @function Controls/Popup/Templates/Dialog/ConfirmationTemplate#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         }
      });
      return DialogTemplate;
   });
