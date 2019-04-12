define('Controls/Popup/Templates/Notification/Base',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls/Popup/Templates/Notification/Base',
      'css!theme?Controls/Popup/Templates/Notification/Base'
   ],
   function(Control, Env, template) {
      var _private = {
         prepareDisplayStyle: function(color) {
            var resColor = color;

            // TODO Remove.
            if (color === 'done') {
               resColor = 'success';
            }
            if (color === 'error') {
               resColor = 'danger';
            }
            return resColor;
         }
      };

      /**
       * Base template of notification popup.
       *
       * @class Controls/Popup/Templates/Notification/Base
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @author Красильников А.С.
       * @mixes Controls/Popup/Templates/Notification/NotificationStyles
       * @demo Controls-demo/Popup/Templates/NotificationTemplatePG
       */

      var Notification = Control.extend({
         _template: template,

         _timerId: null,
         _style: null,

         _beforeMount: function(options) {
            if (options.style === 'error') {
               Env.IoC.resolve('ILogger').warn('Notification', 'Используется устаревшее значение опции style error, используйте danger');
            }
            if (options.style === 'done') {
               Env.IoC.resolve('ILogger').warn('Notification', 'Используется устаревшее значение опции style done, используйте success');
            }
            this._style = _private.prepareDisplayStyle(options.style);
            if (options.iconClose) {
               Env.IoC.resolve('ILogger').warn('Notification', 'Используется устаревшя опция iconClose, используйте closeButtonVisibility');
            }
            if (options.contentTemplate) {
               Env.IoC.resolve('ILogger').warn('Notification', 'Используется устаревшая опция contentTemplate, используйте bodyContentTemplate');
            }
         },
         _beforeUpdate: function(options) {
            this._style = _private.prepareDisplayStyle(options.style);
         },

         _closeClick: function() {
            this._notify('close', []);
         }
      });

      Notification.getDefaultOptions = function() {
         return {
            style: 'primary',
            autoClose: true
         };
      };

      return Notification;
   });

/**
 * @name Controls/Popup/Templates/Notification/Base#autoClose
 * @cfg {Number} Close by timeout after open.
 */

/**
 * @name Controls/Popup/Templates/Notification/Base#style
 * @cfg {String} Notification display style.
 * @variant warning
 * @variant primary
 * @variant success
 * @variant danger
 */

/**
 * @name Controls/Popup/Templates/Notification/Base#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 */

/**
 * @name Controls/Popup/Templates/Notification/Base#bodyContentTemplate
 * @cfg {function|String} Main content.
 */
