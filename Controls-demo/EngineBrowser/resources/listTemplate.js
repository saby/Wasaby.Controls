define('Controls-demo/EngineBrowser/resources/listTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/EngineBrowser/resources/listTemplate'

], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template

      });
   return ModuleClass;
});
