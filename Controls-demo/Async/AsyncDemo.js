define('Controls-demo/Async/AsyncDemo', [
   'Core/Control',
   'Core/Deferred',
   'tmpl!Controls-demo/Async/AsyncDemo'
], function(Control, Deferred, template) {

   var AsyndDemo = Control.extend({
      _template: template,
      _beforeMount: function(options, context, receivedState) {
         var self = this;
         if(receivedState) {
            self.data = receivedState;
            return;
         } else {
            var def = new Deferred();
            setTimeout(function() {
               self.data = ['Controls/Button', 'Controls/Input/Text'];
               def.callback(self.data);
            }, 300);
            return def;
         }
      }

   });

   return AsyndDemo;
});
