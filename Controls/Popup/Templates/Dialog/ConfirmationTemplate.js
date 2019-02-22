define('Controls/Popup/Templates/Dialog/ConfirmationTemplate',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Dialog/ConfirmationTemplate',
      'Env/Env',
      'css!theme?Controls/Popup/Templates/Dialog/ConfirmationTemplate'
   ],
   function(Control, template, Env) {
      'use strict';

      var _private = {
         prepareStatusStyle: function(color) {
            var resColor = color;

            // Todo: remove
            if (color === 'error') {
               resColor = 'danger';
            }
            return resColor;
         },
         prepareSize: function(size) {
            var resSize = size;

            // Todo: remove
            if (size === 'big') {
               resSize = 'l';
            }
            if (size === 'default') {
               resSize = 'm';
            }
            return resSize;
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
          * @demo Controls-demo/Popup/Templates/ConfirmationTemplatePG
          */

         /**
          * @name Controls/Popup/Opener/Confirmation/ConfirmationTemplate#size
          * @cfg {String} Option description.
          * @variant m
          * @variant l
          * @default m
          */

         /**
          * @name Controls/Popup/Templates/Dialog/ConfirmationTemplate#style
          * @cfg {String} Option description.
          * @variant default default
          * @variant success success
          * @variant danger danger
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
         _size: null,
         _beforeMount: function(options) {
            if (options.style === 'error') {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшее значение опции style - error, используйте danger');
            }
            options._style = _private.prepareStatusStyle(options.style);
            this._size = _private.prepareSize(options.size);
            if (options.contentArea) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция contentArea, используйте bodyContentTemplate');
            }
            if (options.footerArea) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция footerArea, используйте footerContentTemplate');
            }
            if (options.size === 'big') {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшее значение опции size - big, используйте l');
            }
            if (options.size === 'default') {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшее значение опции size - default, используйте m');
            }
         },
         _beforeUpdate: function(options) {
            options._style = _private.prepareStatusStyle(options.style);
            this._size = _private.prepareSize(options.size);
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
