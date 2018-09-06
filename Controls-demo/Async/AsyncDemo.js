define('Controls-demo/Async/AsyncDemo', [
   'Core/Control',
   'Core/Deferred',
   'wml!Controls-demo/Async/AsyncDemo'
], function(Control, Deferred, template) {

   var AsyncDemo = Control.extend({
      _template: template,
      _beforeMount: function(options, context, receivedState) {
         var self = this;
         if(receivedState) {
            self.data = receivedState;
            self.is_OK = window.$is_OK$ ? 'true' : 'false';
            return;
         } else {
            var def = new Deferred();
            setTimeout(function() {
               self.data = ['Controls/Input/Text'];
               self.is_OK = 'true';
               def.callback(self.data);
            }, 300);
            return def;
         }
      }

   });

   return AsyncDemo;
});
