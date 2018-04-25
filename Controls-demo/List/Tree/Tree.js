define('Controls-demo/List/Tree/Tree', [
   'Core/Control',
   'Controls-demo/List/Tree/GridData',
   'tmpl!Controls-demo/List/Tree/Tree',
   'Controls-demo/List/Tree/TreeMemory',
   'css!Controls-demo/List/Tree/Tree',
   'Controls/Container/Scroll',
   'Controls/TreeGrid'
], function(BaseControl, GridData, template, MemorySource) {

   'use strict';

   var
      ModuleClass = BaseControl.extend({
         _template: template,

         _viewSource: new MemorySource({
            idProperty: 'id',
            data: GridData.catalog
         }),

         gridData: GridData,
         gridColumns: [
            {
               displayProperty: 'Наименование',
               width: '1fr'
            },
            {
               displayProperty: 'p0',
               width: 'auto',
               align: 'right'
            }
         ]
      });

   return ModuleClass;
});
