define('WSTest/Focus/Case30', [
   'tmpl!WSTest/Focus/Case30',
   'Lib/Control/CompoundControl/CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});