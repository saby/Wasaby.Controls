define('Controls-demo/List/Tree/MassSelection/MassSelection', [
   'Core/Control',
   'Controls-demo/List/Tree/MassSelection/MassSelectionData',
   'tmpl!Controls-demo/List/Tree/MassSelection/MassSelection',
   'WS.Data/Source/Memory',
   'css!Controls-demo/List/Tree/MassSelection/MassSelection'
], function(Control, Data, template, Memory) {
   'use strict';

   var
      ModuleClass = Control.extend({
         _template: template,

         _viewSource: new Memory({
            idProperty: 'id',
            data: Data.catalog
         }),

         gridData: Data,
         gridColumns: [
            {
               displayProperty: 'Наименование',
               width: '1fr'
            }
         ]
      });

   return ModuleClass;
});
