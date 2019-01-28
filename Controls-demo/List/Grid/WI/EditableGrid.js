define('Controls-demo/List/Grid/WI/EditableGrid', [
   'Core/Control',
   'wml!Controls-demo/List/Grid/WI/resources/EditableGrid'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
