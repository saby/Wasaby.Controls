define('Controls/Popup/Templates/Notification/Base',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Notification/Base',
      'css!Controls/Popup/Templates/Notification/Base'
   ],
   function(Control, template) {

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
       */

      var timeAutoClose = 5000;

      var Notification = Control.extend({
         _template: template,

         _timerId: null,

         _beforeMount: function(options) {
            if (options.autoClose) {
               this._autoClose();
            }
         },

         _closeClick: function() {
            this._notify('close', []);
         },

         _mouseenterHandler: function() {
            clearTimeout(this._timerId);
         },

         _mouseleaveHandler: function() {
            if (this._options.autoClose) {
               this._autoClose();
            }
         },

         _autoClose: function() {
            var self = this;

            this._timerId = setTimeout(function() {
               self._notify('close', []);
            }, timeAutoClose);
         }
      });

      Notification.getDefaultOptions = function() {
         return {
            style: 'primary',
            autoClose: true
         };
      };

      return Notification;
   }
);

/**
 * @name Controls/Popup/Templates/Notification/Base#autoClose
 * @cfg {Integer} Close by timeout after open.
 */

/**
 * @name Controls/Popup/Templates/Notification/Base#style
 * @cfg {String} Notification display style.
 */

/**
 * @name Controls/Popup/Templates/Notification/Base#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 */

/**
 * @name Controls/Popup/Templates/Notification/Base#contentTemplate
 * @cfg {String} Main content.
 */
