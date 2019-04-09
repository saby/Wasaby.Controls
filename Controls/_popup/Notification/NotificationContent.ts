import Control = require('Core/Control');
import template = require('wml!Controls/Popup/Opener/Notification/NotificationContent');

      var NotificationContent = Control.extend({
         _template: template,
         _mouseenterHandler: function(event) {
            this._notify('popupMouseEnter', [event]);
         },

         _mouseleaveHandler: function(event) {
            this._notify('popupMouseLeave', [event]);
         }
      });

      export = NotificationContent;
   
