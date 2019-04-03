define('Controls-demo/Confirmation/ConfirmationApplication', [
   'Core/Control',
   'wml!Controls-demo/Confirmation/ConfirmationApplication'
], function(Control, template) {
   'use strict';

   var DemoConfirm = Control.extend(
      {
         _template: template
      });
   return DemoConfirm;
});
