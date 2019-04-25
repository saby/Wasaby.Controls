define('Controls-demo/Input/Validate/ValidateInfobox', [
   'Core/Control',
   'wml!Controls-demo/Input/Validate/ValidateInfobox'
], function(Control, template) {
   'use strict';

   var DemoValidate = Control.extend(
      {
         _template: template
      });
   return DemoValidate;
});
