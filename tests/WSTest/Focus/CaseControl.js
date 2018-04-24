define('WSTest/Focus/CaseControl', [
   'Lib/Control/CompoundControl/CompoundControl'
], function(CompoundControl) {

   var moduleClass = CompoundControl.extend({
      constructor: function(cfg) {
         moduleClass.superclass.constructor.call(this, cfg);
      }
   });

   return moduleClass;
});