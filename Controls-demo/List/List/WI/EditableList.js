define('Controls-demo/List/List/WI/EditableList', [
   'Core/Control',
   'wml!Controls-demo/List/List/WI/resources/EditableList'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
