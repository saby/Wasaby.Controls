define('Controls/Controllers/Multiselect/Strategy/Hierarchy/Base', [
   'Core/core-simpleExtend',
   'WS.Data/Relation/Hierarchy',
   'Controls/Utils/ArraySimpleValuesUtil'
], function(
   cExtend,
   HierarchyRelation,
   ArraySimpleValuesUtil
) {
   'use strict';

   var Base = cExtend.extend({
      constructor: function(options) {
         this._hierarchyRelation = new HierarchyRelation({
            idProperty: options.keyProperty || 'id',
            parentProperty: options.parentProperty || 'Раздел',
            nodeProperty: options.nodeProperty || 'Раздел@'
         });

         Base.superclass.constructor.apply(this, arguments);
      },

      getAllChildren: function(rootId, items) {
         var children = [];

         this._hierarchyRelation.getChildren(rootId, items).forEach(function(child) {
            if (this._hierarchyRelation.isNode(child)) {
               ArraySimpleValuesUtil.addSubArray(children, this.getAllChildren(child.getId(), items));
            }
            ArraySimpleValuesUtil.addSubArray(children, [child]);
         }.bind(this));

         return children;
      },

      getChildrenIds: function(rootId, items) {
         return this.getAllChildren(rootId, items).map(function(child) {
            return child.getId();
         });
      },

      isParentSelected: function(key, selectedKeys, excludedKeys, items) {
         if (key === null) {
            return selectedKeys[0] === null;
         }

         var
            parent = this._hierarchyRelation.getParent(key, items),
            parentSelected = false,
            parentId;

         while (parent) {
            parentId = parent.getId();
            if (selectedKeys.indexOf(parentId) !== -1) {
               parentSelected = true;
               break;
            }
            if (excludedKeys.indexOf(parentId) !== -1) {
               break;
            }
            parent = this._hierarchyRelation.getParent(parentId, items);
         }

         if (parent === null && selectedKeys[0] === null) {
            parentSelected = true;
         }

         return parentSelected;
      },

      getSelectedChildrenCount: function(rootId, selectedKeys, excludedKeys, items) {
         var
            parentSelected = selectedKeys.indexOf(rootId) !== -1 || this.isParentSelected(rootId, selectedKeys, excludedKeys, items),
            childId;

         return this._hierarchyRelation.getChildren(rootId, items).reduce(function(acc, child) {
            childId = child.getId();

            if (selectedKeys.indexOf(childId) !== -1 || parentSelected && excludedKeys.indexOf(childId) === -1) {
               if (this._hierarchyRelation.isNode(child)) {
                  return acc + 1 + this.getSelectedChildrenCount(childId, selectedKeys, excludedKeys, items);
               } else {
                  return acc + 1;
               }
            } else {
               if (this._hierarchyRelation.isNode(child) && excludedKeys.indexOf(childId) === -1) {
                  return acc + this.getSelectedChildrenCount(childId, selectedKeys, excludedKeys, items);
               } else {
                  return acc;
               }
            }
         }.bind(this), 0);
      },

      getCount: function(selectedKeys, excludedKeys, items) {
         return this.getSelectedChildrenCount(null, selectedKeys, excludedKeys, items);
      },

      isAllSelection: function(options) {
         var
            rootId = options.rootId,
            selectedKeys = options.selectedKeys,
            excludedKeys = options.excludedKeys,
            items = options.items,
            isParentSelected = this.isParentSelected(rootId, selectedKeys, excludedKeys, items);

         return isParentSelected || selectedKeys.indexOf(rootId) !== -1;
      }
   });

   return Base;
});
