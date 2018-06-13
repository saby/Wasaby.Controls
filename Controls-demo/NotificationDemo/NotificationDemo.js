define('Controls-demo/NotificationDemo/NotificationDemo', [
   'Core/Control',
   'tmpl!Controls-demo/NotificationDemo/NotificationDemo',
   'tmpl!Controls/Popup/Templates/Notification/Simple'
], function(Control, template) {
   return Control.extend({
      _template: template,
      _openNotification: function() {
        this._children.myOpener.open();
      },
      _closeNotification: function() {
         this._children.myOpener.close();
      }
   });
});
