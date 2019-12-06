define('Controls-demo/CompatibleDemo/Compat/WS3/Index', [
   'Core/Control',
   'wml!Controls-demo/CompatibleDemo/Compat/WS3/Index'
], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _beforeMount: function() {
            try {
               /* TODO: set to presentation service */
               process.domain.req.compatible = true;
            } catch (e) {
            }
         },
      }
   );

   return ModuleClass;
});
