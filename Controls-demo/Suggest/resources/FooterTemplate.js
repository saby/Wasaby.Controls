define('Controls-demo/Suggest/resources/FooterTemplate', [
   'Core/Control',
   'wml!Controls-demo/Suggest/resources/FooterTemplate'
], function(Control, template) {
   return Control.extend({
      _template: template
   });
});