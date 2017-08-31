define('js!WSTest/Focus/CaseControl', [
   'js!SBIS3.CORE.CompoundControl'
], function(CompoundControl) {

   var moduleClass = CompoundControl.extend({
      constructor: function(cfg) {
         moduleClass.superclass.constructor.call(this, cfg);
      }
   });

   return moduleClass;
});