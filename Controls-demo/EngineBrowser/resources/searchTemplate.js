define('Controls-demo/EngineBrowser/resources/searchTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/EngineBrowser/resources/searchTemplate'

], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         value: ''

      });
   return ModuleClass;
});
