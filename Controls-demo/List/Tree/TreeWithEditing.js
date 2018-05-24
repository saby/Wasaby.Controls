define('Controls-demo/List/Tree/TreeWithEditing', [
   'Core/Control',
   'Controls-demo/List/Tree/TreeWithEditingData',
   'tmpl!Controls-demo/List/Tree/TreeWithEditing',
   'Controls-demo/List/Tree/TreeMemory',
   'tmpl!Controls-demo/List/Tree/treeEditingTemplate',
   'css!Controls-demo/List/Tree/Tree'
], function(
   BaseControl,
   TreeWithEditingData,
   template,
   MemorySource,
   treeEditingTemplate
) {

   'use strict';

   var
      TreeWithEditing = BaseControl.extend({
         _template: template,

         _viewSource: new MemorySource({
            idProperty: 'id',
            data: TreeWithEditingData.catalog
         }),

         gridData: TreeWithEditingData,
         gridColumns: [
            {
               displayProperty: 'Наименование',
               width: '1fr',
               template: treeEditingTemplate
            },
            {
               displayProperty: 'Описание',
               width: 'auto',
               template: treeEditingTemplate
            }
         ]
      });

   return TreeWithEditing;
});
