define('Controls-demo/NotificationDemo/NotificationTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/NotificationDemo/NotificationTemplate',
      'wml!Controls-demo/Popup/Opener/resources/CustomNotification',
      'css!Controls-demo/NotificationDemo/NotificationTemplate'
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
