define('Controls-demo/CompatibleDemo/Compat/DemoControls/TextBoxWrapper', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/CompatibleDemo/Compat/DemoControls/TextBoxWrapper'
], function(CompoundControl, template) {

   var CompatibleDemo = CompoundControl.extend({
      _dotTplFn: template,

      init: function() {
         CompatibleDemo.superclass.init.call(this);
      },
      destroy: function() {
         CompatibleDemo.superclass.destroy.apply(this, arguments);
      }
   });

   return CompatibleDemo;
});
