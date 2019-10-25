import {relation} from 'Types/entity';
import {default as ArraySimpleValuesUtil} from 'Controls/Utils/ArraySimpleValuesUtil';

const ALL_SELECTION_VALUE = null;

export default {
   isNode: function(item, hierarchyRelation: relation.Hierarchy): boolean {
      return hierarchyRelation.isNode(item) !== null;
   },

   // Возвращает кол-во выбранных записей в папке, идет в глубь до первого исключения
   getSelectedChildrenCount: function(nodeId, selectedKeys, excludedKeys, items, hierarchyRelation, deep): number|null {
      let countSelectedChildren: number|null = null;
      let children: [] = hierarchyRelation.getChildren(nodeId, items);

      if (children.length) {
         for (let index = 0; index < children.length; index++) {
            let childItem = children[index];
            let childId: number|string = childItem.getId();

            if (!excludedKeys.includes(childId)) {
               countSelectedChildren++;

               if (hierarchyRelation.isNode(childItem) !== null && deep !== false) {
                  let countSelectedChildren2: number|null = this.getSelectedChildrenCount(childId, selectedKeys, excludedKeys, items, hierarchyRelation);

                  if (countSelectedChildren2 === null) {
                     countSelectedChildren = null;
                     break;
                  } else {
                     countSelectedChildren += countSelectedChildren2;
                  }
               }
            }
         }
      }

      return countSelectedChildren;
   },

   getSelectedParent: function(key, selectedKeys, excludedKeys, hierarchyRelation, items) {
      let selectedParent: string|number|null|undefined;
      let currentParentId: string|number|null = this.getParentId(key, items, hierarchyRelation.getParentProperty());
      let isParentExcluded: boolean = false;

      for (;currentParentId; currentParentId = this.getParentId(currentParentId, items, hierarchyRelation.getParentProperty())) {
         if (selectedKeys.includes(currentParentId)) {
            selectedParent = currentParentId;
            break;
         } else if (excludedKeys.includes(currentParentId)) {
            isParentExcluded = true;
            break;
         }
      }

      // Надо добавить работу с ENTRY_PATH
      if (!isParentExcluded && selectedParent === undefined && selectedKeys.includes(ALL_SELECTION_VALUE)) {
         selectedParent = null;
      }

      return selectedParent;
   },


   getParentId: function(key, items, parentProperty) {
      let item = items.getRecordById(key);

      return item && item.get(parentProperty);
   },

   getChildrenIds: function(nodeId, items, hierarchyRelation) {
      return this.getAllChildren(nodeId, items, hierarchyRelation).map((child) => {
         return child.getId();
      });
   },

   getAllChildren: function(nodeId, items, hierarchyRelation) {
      let children: [] = [];

      hierarchyRelation.getChildren(nodeId, items).forEach((child) => {
         ArraySimpleValuesUtil.addSubArray(children, [child]);

         if (this.isNode(child, hierarchyRelation)) {
            ArraySimpleValuesUtil.addSubArray(children, this.getAllChildren(child.getId(), items, hierarchyRelation));
         }
      });

      return children;
   },

   hasChildrenInList: function(itemId, listKeys, items, hierarchyRelation) {
      let hasChildrenInList: boolean = false;
      let children: [] = hierarchyRelation.getChildren(itemId, items);

      for (let index = 0; index < children.length; index++) {
         let child = children[index];
         let childrenId = child.getId();

         if (listKeys.includes(childrenId) || SelectionHelper.isNode(child, hierarchyRelation) &&
            this._hasChildrenInList(childrenId, listKeys, items, hierarchyRelation)) {

            hasChildrenInList = true;
            break;
         }
      }

      return hasChildrenInList;
   },

   removeSelectionChildren: function(nodeId, selectedKeys, excludedKeys, items, hierarchyRelation) {
      let childrenIds: TKeys = this.getChildrenIds(nodeId, items, hierarchyRelation);

      ArraySimpleValuesUtil.removeSubArray(selectedKeys, childrenIds);
      ArraySimpleValuesUtil.removeSubArray(excludedKeys, childrenIds);
   }
};
