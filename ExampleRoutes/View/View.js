define('ExampleRoutes/View/View', ['Lib/Control/CompoundControl/CompoundControl', 'tmpl!ExampleRoutes/View/View'], function(CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      init: function() {
         moduleClass.superclass.init.call(this);
      }
   });

   return moduleClass;
});
