define('Controls-demo/Checkbox/GroupWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Checkbox/GroupWithApplication'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
