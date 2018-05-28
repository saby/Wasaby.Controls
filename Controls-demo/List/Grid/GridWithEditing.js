define('Controls-demo/List/Grid/GridWithEditing', [
   'Core/Control',
   'Controls-demo/List/Grid/GridWithEditingData',
   'tmpl!Controls-demo/List/Grid/GridWithEditing',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/List/Tree/treeEditingTemplate',
   'tmpl!Controls-demo/List/Grid/DemoItem',
   'tmpl!Controls-demo/List/Grid/DemoBalancePrice',
   'tmpl!Controls-demo/List/Grid/DemoCostPrice',
   'tmpl!Controls-demo/List/Grid/DemoHeaderCostPrice',

   'tmpl!Controls-demo/List/Grid/DemoTasksPhoto',
   'tmpl!Controls-demo/List/Grid/DemoTasksDescr',
   'tmpl!Controls-demo/List/Grid/DemoTasksReceived',
   'Controls/Render/Money/Money',
   'css!Controls-demo/List/Grid/Grid',
   'Controls/Container/Scroll',
   'Controls/Grid',
   'Controls/Render/Money/Money'
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
               displayProperty: 'name',
               width: '1fr',
               template: 'tmpl!Controls-demo/List/Tree/treeEditingTemplate'
            },
            {
               displayProperty: 'price',
               width: 'auto',
               align: 'right',
               template: 'tmpl!Controls-demo/List/Grid/DemoCostPrice'
            },
            {
               displayProperty: 'balance',
               width: 'auto',
               align: 'right',
               template: 'tmpl!Controls-demo/List/Grid/DemoBalancePrice'
            },
            {
               displayProperty: 'description',
               width: '1fr',
               align: 'right',
               template: 'tmpl!Controls-demo/List/Tree/treeEditingTemplate'
            },
            {
               displayProperty: 'costPrice',
               width: 'auto',
               align: 'right',
               template: 'tmpl!Controls-demo/List/Grid/DemoCostPrice'
            },
            {
               displayProperty: 'balanceCostSumm',
               width: 'auto',
               align: 'right',
               template: 'tmpl!Controls-demo/List/Grid/DemoCostPrice'
            }
         ],
         gridHeader: [
            {
               title: ''
            },
            {
               title: 'Цена',
               align: 'right'
            },
            {
               title: 'Остаток',
               align: 'right'
            },
            {
               title: 'Описание',
               align: 'right'
            },
            {
               title: 'Себест.',
               align: 'right',
               template: 'tmpl!Controls-demo/List/Grid/DemoHeaderCostPrice'
            },
            {
               title: 'Сумма остатка',
               align: 'right'
            }
         ],

         tasksColumns: [
            {
               template: 'tmpl!Controls-demo/List/Grid/DemoTasksPhoto',
               width: 'auto'
            },
            {
               template: 'tmpl!Controls-demo/List/Grid/DemoTasksDescr',
               width: '1fr'
            },
            {
               template: 'tmpl!Controls-demo/List/Grid/DemoTasksReceived',
               width: 'auto'
            }
         ]
      });

   return ModuleClass;
});
