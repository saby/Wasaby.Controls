define('Controls-demo/List/Tree/MultiSelection/MultiSelection', [
   'Core/Control',
   'Controls-demo/List/Tree/MultiSelection/MultiSelectionData',
   'wml!Controls-demo/List/Tree/MultiSelection/MultiSelection',
   'Types/source',
   'css!Controls-demo/List/Tree/MultiSelection/MultiSelection'
], function(Control, Data, template, source) {
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
            this._viewSource = new source.Memory({
               keyProperty: 'id',
               data: Data.catalog
            });
         }
      });

   return ModuleClass;
});
