define('Controls/Popup/Compatible/Notification/Base',
   [
      'Core/Control',
      'wml!Controls/Popup/Compatible/Notification/Base',
      'css!Controls/Popup/Templates/Notification/Base'
   ],
   function(Control, template) {

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
