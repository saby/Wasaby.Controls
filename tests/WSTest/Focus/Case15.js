define('WSTest/Focus/Case15', [
   'tmpl!WSTest/Focus/Case15',
   'Lib/Control/CompoundControl/CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});