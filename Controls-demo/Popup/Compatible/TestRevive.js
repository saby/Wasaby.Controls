define('Controls-demo/Popup/Compatible/TestRevive', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestRevive'
], function(CompoundControl, dotTplFn) {
   var TestRevive = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });

   return TestRevive;
});
