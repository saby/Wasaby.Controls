define('Controls/Popup/Compatible/Notification/Base',
   [
      'Controls/Popup/Templates/Notification/Base',
      'wml!Controls/Popup/Compatible/Notification/Base'
   ],
   function(NotificationBase, template) {

      var Notification = NotificationBase.extend({
         _template: template
      });

      return Notification;
   }
);
