define('Controls-demo/AsyncError/AsyncDemo', [
   'Core/Control',
   'wml!Controls-demo/AsyncError/AsyncDemo'
], function(Control, template) {

   var AsyncDemo = Control.extend({
      _template: template
   });

   return AsyncDemo;
});
