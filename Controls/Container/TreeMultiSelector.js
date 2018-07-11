define('Controls/Container/TreeMultiSelector', [
   'Controls/Container/MultiSelector',
   'Controls/Controllers/Multiselect/HierarchySelection'
], function(
   MultiSelector,
   HierarchySelection
) {
   'use strict';

   return MultiSelector.extend({
      _createMultiselection: function(options, items) {
         this._multiselection = new HierarchySelection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: items,
            idProperty: options.keyProperty,
            parentProperty: options.parentProperty,
            nodeProperty: options.nodeProperty
         });
      }
   });
});
