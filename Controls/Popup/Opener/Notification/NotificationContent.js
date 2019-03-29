define('Controls/Popup/Opener/Notification/NotificationContent',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/Notification/NotificationContent'
   ],
   function(Control, template) {

      var NotificationContent = Control.extend({
         _template: template,
         _mouseenterHandler: function(event) {
            this._notify('popupMouseEnter', [event]);
         },

         _mouseleaveHandler: function(event) {
            this._notify('popupMouseLeave', [event]);
         }
      });

      return NotificationContent;
   });
