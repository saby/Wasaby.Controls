define('Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/vdomFilterButtonTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/vdomFilterButtonTemplate'

], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,

         _itemTemplate: {
            templateName: 'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/filterItemsTemplate'
         },

         _additionalTemplate: {
            templateName: 'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/additionalItemsTemplate'
         }

      });
   return ModuleClass;
});
