define('Controls-demo/AsyncError/AsyncDemo', [
   'Core/Control',
   'Core/Deferred',
   'wml!Controls-demo/AsyncError/AsyncDemo'
], function(Control, Deferred, template) {

   var AsyncDemo = Control.extend({
      _template: template,
      _beforeMount: function(options, context, receivedState) {

      }

   });

   return AsyncDemo;
});
