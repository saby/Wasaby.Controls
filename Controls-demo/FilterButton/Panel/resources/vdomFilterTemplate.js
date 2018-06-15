
define('Controls-demo/FilterButton/Panel/resources/vdomFilterTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/FilterButton/Panel/resources/vdomFilterTemplate'

], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,

         _additionalTemplate: {
            templateName: 'tmpl!Controls-demo/FilterButton/Panel/resources/additionalItemsTemplate2'
         }

      });
   return ModuleClass;
});
