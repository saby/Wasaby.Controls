define('Controls/Popup/Compatible/OldNotification',
   [
      'Core/Control',
      'wml!Controls/Popup/Compatible/OldNotification/OldNotification',
      'css!theme?Controls/Popup/Compatible/OldNotification/OldNotification'
   ],
   function(Control, template) {
      var OldNotification = Control.extend({
         _template: template,
         _close: function() {
            this.getParent().close();
         }
      });

      return OldNotification;
   });
