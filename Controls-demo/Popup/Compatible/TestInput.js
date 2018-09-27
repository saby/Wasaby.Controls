define('Controls-demo/Popup/Compatible/TestInput', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestInput'
], function(CompoundControl, dotTplFn) {
   var TestInput = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });

   return TestInput;
});
