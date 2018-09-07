define('Controls-demo/NotificationDemo/NotificationDemo',
   [
      'Core/Control',
      'wml!Controls-demo/NotificationDemo/NotificationDemo',
      'wml!Controls/Popup/Templates/Notification/Simple'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _openNotification: function(e, index) {
            this._children['myOpener' + index].open();
         },

         _closeNotification: function(e, index) {
            this._children['myOpener' + index].close();
         }
      });
   });
