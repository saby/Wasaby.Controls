define('Controls-demo/SelectionStrategies/SelectionStrategies', [
   'Core/Control',
   'wml!Controls-demo/SelectionStrategies/SelectionStrategies',
   'Controls/_operations/MultiSelector/SelectionStrategy/Tree',
   'Engine-demo/Selector/SelectorData',
   'Engine-demo/Selector/TreeListSelector/SelectorMemory',

   // Зависит от другой демки, надо переписать
   'Controls-demo/OperationsPanel/Demo/Data',
   'wml!Controls-demo/OperationsPanel/Demo/PersonInfo',
   'css!Controls-demo/OperationsPanel/Demo/Demo'
], function(Control, template, TreeSelectionStrategy, SelectorData, MemorySource, Data) {
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
         this._viewSource = new MemorySource({
            keyProperty: 'id',
            data: Data.employees
         });
      }
   });
});
