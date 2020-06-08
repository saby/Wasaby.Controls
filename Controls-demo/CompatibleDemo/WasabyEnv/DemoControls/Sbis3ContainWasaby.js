define('Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/Sbis3ContainWasaby', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/Sbis3ContainWasaby'
], function(CompoundControl, template) {

   var CompatibleDemoNext = CompoundControl.extend({
      _dotTplFn: template,

      init: function(opts) {
         CompatibleDemoNext.superclass.init.call(this);
      }
   });

   return CompatibleDemoNext;
});
