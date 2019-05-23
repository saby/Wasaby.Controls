define('Controls-demo/PropertyGrid/propertyGridUtil', function() {
   'use strict';

   return {
      getDemoName: function(controlName) {
         var testName = controlName.split(/[/:]/);
         testName.splice(0, 1);
         return testName.join('');
      }
   };
});
