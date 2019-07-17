define('Controls-demo/Async/AsyncDemo', [
   'Core/Control',
   'Env/Env',
   'wml!Controls-demo/Async/AsyncDemo'
], function(Control, Env, template) {

   var AsyncDemo = Control.extend({
      _template: template,
      templateName1: 'Controls-demo/Async/testLib:testModule',
      templateName2: 'Controls-demo/Async/testModuleNoLib',
      isOK: 'false',
      _beforeMount: function(options, context, receivedState) {
         if(typeof window !== 'undefined') {
            if(Env.cookie.get('s3debug') !== 'true') {
               var libModule = false, noLibModule = false;
               var scripts = document.querySelectorAll('script');
               for(var i = 0; i < scripts.length; i++) {
                  if(~scripts[i].src.indexOf('testLib')) {
                     libModule = true;
                  }
                  if(~scripts[i].src.indexOf('testModuleNoLib')) {
                     noLibModule = true;
                  }
               }
               if(libModule && noLibModule) {
                  this.isOK = 'true';
               }
            }
         }
      }
   });

   return AsyncDemo;
});
