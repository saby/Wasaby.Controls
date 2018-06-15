define('Controls-demo/Browser/resources/listTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/Browser/resources/listTemplate'

], function(BaseControl, template) {
   'use strict';



   var ModuleClass = BaseControl.extend(
      {
         _template: template

      });
   return ModuleClass;
});
