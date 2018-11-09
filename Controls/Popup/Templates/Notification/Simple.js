define('Controls/Popup/Templates/Notification/Simple',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Notification/Simple'
   ],
   function(Control, template) {

      /**
       * Template (WML) of simple notification.
       *
       * @class Controls/Popup/Templates/Notification/Simple
       * @extends Core/Control
       * @control
       * @public
       * @category popup
       * @author Красильников А.С.
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
 * @name Controls/Popup/Templates/Notification/Simple#autoClose
 * @cfg {Integer} Close by timeout after open.
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#style
 * @cfg {String} Notification display style.
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#closeButtonVisibility
 * @cfg {Boolean} Determines whether display of the close button.
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#icon
 * @cfg {Object} Notification message icon.
 */

/**
 * @name Controls/Popup/Templates/Notification/Simple#text
 * @cfg {String} Notification message.
 */
