define('Controls-demo/ContainerTheme', [
   'Core/Control',
   'wml!Controls-demo/ContainerTheme'
], function(BaseControl,
            template
) {
   'use strict';

   /**
    * This control trying to get theme option from url and pass it to demo
    */
   var ModuleClass = BaseControl.extend(
      {
         _template: template
      });

   return ModuleClass;
});