define('Controls-demo/List/Tree/MultiSelection/MultiSelection', [
   'Core/Control',
   'Controls-demo/List/Tree/MultiSelection/MultiSelectionData',
   'tmpl!Controls-demo/List/Tree/MultiSelection/MultiSelection',
   'WS.Data/Source/Memory',
   'css!Controls-demo/List/Tree/MultiSelection/MultiSelection'
], function(Control, Data, template, Memory) {
   'use strict';

   var
      ModuleClass = Control.extend({
         _template: template,

         _viewSource: null,
         gridData: null,
         gridColumns: null,
         _beforeMount: function() {
            this.gridColumns = [
               {
                  displayProperty: 'Наименование',
                  width: '1fr'
               }
            ];
            this.gridData = Data;
            this._viewSource = new Memory({
               idProperty: 'id',
               data: Data.catalog
            });
         }
      });

   return ModuleClass;
});
