define('Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/WS3Container', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/WS3Container'
], function(CompoundControl, template) {

   var CompatibleDemoNext = CompoundControl.extend({
      _dotTplFn: template
   });

   return CompatibleDemoNext;
});
