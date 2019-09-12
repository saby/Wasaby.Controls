define('Controls-demo/List/Tree/ExpandAll', [
   'Core/Control',
   'wml!Controls-demo/List/Tree/resources/ExpandAll/ExpandAll',
   'Types/source',
   'Controls-demo/List/Tree/resources/Data',
   'Controls/treeGrid',
   'css!Controls-demo/List/Tree/resources/ExpandAll/ExpandAll'
], function (Control, template, source, TreeData) {
   'use strict';

   var
      ModuleClass = Control.extend({
         _template: template,
         _viewSource: null,
         _columns: [
            {
               displayProperty: 'title'
            }
         ],
         _expandedItems: [null],

         _beforeMount: function() {
            this._viewSource = new source.Memory({
               keyProperty: 'id',
               data: TreeData.generate()
            });
         }
      });
   return ModuleClass;
});
