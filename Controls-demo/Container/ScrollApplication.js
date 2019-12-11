define('Controls-demo/Container/ScrollApplication', [
   'Core/Control',
   'wml!Controls-demo/Container/ScrollApplication'
], function(Control, template) {
   return Control.extend({
      _template: template
   });
});
