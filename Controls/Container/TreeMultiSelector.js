define('Controls/Container/TreeMultiSelector', [
   'Controls/Container/MultiSelector',
   'Controls/Controllers/Multiselect/HierarchySelection'
], function(
   MultiSelector,
   HierarchySelection
) {
   'use strict';

   /**
    * Container for content that can work with multiselection.
    * Puts selection in child context.
    *
    * @class Controls/Container/TreeMultiSelector
    * @extends Controls/Container/MultiSelector
    * @control
    * @author Зайцев А.С.
    * @public
    */

   /**
    * @name Controls/Container/TreeMultiSelector#nodeProperty
    * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
    */

   /**
    * @name Controls/Container/TreeMultiSelector#parentProperty
    * @cfg {String} Name of the field that contains information about parent node.
    */

   return MultiSelector.extend({
      _createMultiselection: function(options, context) {
         this._multiselection = new HierarchySelection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: context.dataOptions.items,
            idProperty: context.dataOptions.keyProperty,
            parentProperty: options.parentProperty,
            nodeProperty: options.nodeProperty
         });
      }
   });
});
