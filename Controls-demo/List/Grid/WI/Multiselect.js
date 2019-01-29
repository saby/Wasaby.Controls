define('Controls-demo/List/Grid/WI/Multiselect', [
   'Core/Control',
   'wml!Controls-demo/List/Grid/WI/resources/Multiselect'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
