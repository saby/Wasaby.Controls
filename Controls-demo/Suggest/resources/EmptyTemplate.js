define('Controls-demo/Suggest/resources/EmptyTemplate', [
   'Core/Control',
   'wml!Controls-demo/Suggest/resources/EmptyTemplate'
], function(Control, template) {
   return Control.extend({
      _template: template
   });
});