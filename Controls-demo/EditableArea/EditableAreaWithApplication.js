define('Controls-demo/EditableArea/EditableAreaWithApplication', [
   'Core/Control',
   'wml!Controls-demo/EditableArea/EditableAreaWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
