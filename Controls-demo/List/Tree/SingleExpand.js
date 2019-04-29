define('Controls-demo/List/Tree/SingleExpand', [
   'Core/Control',
   'Controls-demo/List/Tree/GridData',
   'wml!Controls-demo/List/Tree/SingleExpand',
   'Controls-demo/List/Tree/TreeMemory',
   'css!Controls-demo/List/Tree/Tree',
   'Controls/Container/Scroll',
   'Controls/treeGrid',
   'wml!Controls-demo/List/Tree/DemoContentTemplate'
], function(BaseControl, GridData, template, MemorySource) {
   'use strict';
   var ModuleClass = BaseControl.extend({
          _template: template,
          _groupingKeyCallback: null,
          _viewSource: null,
          gridData: null,
          gridColumns: null,
          _beforeMount: function() {
             this.gridColumns = [
                {
                   displayProperty: 'Наименование',
                   width: '1fr',
                   template: 'wml!Controls-demo/List/Tree/DemoContentTemplate'
                }
             ];
             this.gridData = GridData;
             this._viewSource = new MemorySource({
                idProperty: 'id',
                data: GridData.catalog
             });
          }

       });

   return ModuleClass;
});
