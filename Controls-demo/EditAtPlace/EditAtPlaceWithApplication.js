define('Controls-demo/EditAtPlace/EditAtPlaceWithApplication', [
   'Core/Control',
   'wml!Controls-demo/EditAtPlace/EditAtPlaceWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
