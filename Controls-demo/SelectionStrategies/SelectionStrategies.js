define('Controls-demo/SelectionStrategies/SelectionStrategies', [
   'Core/Control',
   'wml!Controls-demo/SelectionStrategies/SelectionStrategies',
   'Controls/_operations/MultiSelector/SelectionStrategy/Tree',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls-demo/OperationsPanel/Demo/Data',

   // Зависит от другой демки, надо переписать
   'wml!Controls-demo/OperationsPanel/Demo/PersonInfo',
   'css!Controls-demo/OperationsPanel/Demo/Demo'
], function(Control, template, TreeSelectionStrategy, TreeMemory, Data) {
   'use strict';

   return Control.extend({
      _template: template,
      _treeSelectionStrategy: null,
      _gridColumns: null,

      _beforeMount() {
         this._treeSelectionStrategy = TreeSelectionStrategy.default;
         this._gridColumns = [{
            template: 'wml!Controls-demo/OperationsPanel/Demo/PersonInfo'
         }];
         this._viewSource = new TreeMemory({
            keyProperty: 'id',
            data: Data.employees
         });
      }
   });
});
