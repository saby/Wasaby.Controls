define('Controls-demo/Input/Validate/ValidateApplication', [
   'Core/Control',
   'wml!Controls-demo/Input/Validate/ValidateApplication'
], function(Control, template) {
   'use strict';

   var DemoValidate = Control.extend(
      {
         _template: template
      }
   );
   return DemoValidate;
});
