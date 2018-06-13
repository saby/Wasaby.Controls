define('Controls/Popup/Templates/Notification/Base', [
   'Core/Control',
   'tmpl!Controls/Popup/Templates/Notification/Base',
   'css!Controls/Popup/Templates/Notification/Base'
],
function(Control, template) {
   var Notification =  Control.extend({
      _template: template,

      _closeClick: function() {
         this._notify('close', []);
      }
   });

   Notification.getDefaultOptions = function() {
      return {
         style: 'primary'
      };
   };

   return Notification;
});
