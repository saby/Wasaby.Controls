define('Controls-demo/NotificationDemo/NotificationApplication', [
   'Core/Control',
   'wml!Controls-demo/NotificationDemo/NotificationApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
