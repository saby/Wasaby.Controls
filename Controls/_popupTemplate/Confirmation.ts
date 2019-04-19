import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Confirmation/Confirmation');
import Env = require('Env/Env');
import 'css!theme?Controls/_popupTemplate/Confirmation/Confirmation';


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
          * @class Controls/_popupTemplate/Confirmation
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/_popupTemplate/Confirmation/ConfirmationTmplStyles
          * @demo Controls-demo/Popup/Templates/ConfirmationTemplatePG
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#size
          * @cfg {String} Confirmation size
          * @variant m
          * @variant l
          * @default m
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#style
          * @cfg {String} Confirmation display style
          * @variant default default
          * @variant success success
          * @variant danger danger
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the confirm panel.
          */

         _template: template,
         _size: null,
         _beforeMount: function(options) {
            if (options.style === 'error') {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшее значение опции style - error, используйте danger');
            }
            this._style = _private.prepareStatusStyle(options.style);
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
            this._style = _private.prepareStatusStyle(options.style);
            this._size = _private.prepareSize(options.size);
         },

         /**
          * Close the dialog
          * @function Controls/_popupTemplate/Confirmation#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         }
      });
      export = DialogTemplate;

