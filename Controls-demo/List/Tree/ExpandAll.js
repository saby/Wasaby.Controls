define('Controls-demo/List/Tree/ExpandAll', [
   'Core/Control',
   'wml!Controls-demo/List/Tree/resources/ExpandAll/ExpandAll',
   'WS.Data/Source/Memory',
   'Controls-demo/List/Tree/resources/Data',
   'Controls/TreeGrid',
   'css!Controls-demo/List/Tree/resources/ExpandAll/ExpandAll'
], function (Control, template, MemorySource, TreeData) {
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

         _beforeMount: function() {
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: TreeData.generate()
            });
         }
      });
   return ModuleClass;
});
