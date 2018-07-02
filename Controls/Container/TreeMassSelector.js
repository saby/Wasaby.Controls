define('Controls/Container/TreeMassSelector', [
   'Controls/Container/MassSelector',
   'Controls/Controllers/Multiselect/HierarchySelection'
], function(
   MassSelector,
   HierarchySelection
) {
   'use strict';

   return MassSelector.extend({
      _createMultiselection: function(options, items) {
         this._multiselection = new HierarchySelection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: items,
            strategy: options.strategy,
            idProperty: options.keyProperty,
            parentProperty: options.parentProperty,
            nodeProperty: options.nodeProperty
         });
      }
   });
});
