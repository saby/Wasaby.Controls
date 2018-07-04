define('Controls/Container/TreeMultiSelector', [
   'Controls/Container/MultiSelector',
   'Controls/Controllers/Multiselect/HierarchySelection'
], function(
   MultiSelector,
   HierarchySelection
) {
   'use strict';

   return MultiSelector.extend({
      _createMultiselection: function(options, context) {
         this._multiselection = new HierarchySelection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: context.dataOptions.items,
            strategy: options.strategy,
            idProperty: context.dataOptions.keyProperty,
            parentProperty: options.parentProperty,
            nodeProperty: options.nodeProperty
         });
      }
   });
});
