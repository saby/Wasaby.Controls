define('Controls-demo/Suggest/SearchInputApplication', [
   'Core/Control',
   'wml!Controls-demo/Suggest/SearchInputApplication'
], function(Control, template) {
   'use strict';
   return Control.extend({
      _template: template
   });
});
