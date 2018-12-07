define('Controls-demo/Popup/Edit/OpenerWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Popup/Edit/OpenerWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
