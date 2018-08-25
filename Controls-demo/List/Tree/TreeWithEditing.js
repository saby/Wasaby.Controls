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
         _viewSource: null,
         gridData: null,
         gridColumns: null,
         _beforeMount: function() {
            this.gridColumns = [
               {
                  displayProperty: 'Наименование',
                  width: '1fr',
                  template: treeEditingTemplate
               },
               {
                  displayProperty: 'Описание',
                  width: '1fr',
                  template: treeEditingTemplate
               }
            ];
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: TreeWithEditingData.catalog
            });
            this.gridData = TreeWithEditingData;
         },

         _onBeforeItemAdd: function() {
            return this._viewSource.create().addCallback(function(model) {
               model.set('Раздел', null);
               model.set('Раздел@', true);
               model.set('Раздел$', null);
               return {
                  item: model
               };
            });
         }
      });

   return TreeWithEditing;
});
