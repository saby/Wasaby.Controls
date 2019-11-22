import {relation} from 'Types/entity';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { Collection, Tree as TreeCollection } from 'Controls/display';

import { Record, List } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ListViewModel } from 'Controls/list';
import { ViewModel } from 'Controls/treeGrid';
import { TKeySelection as TKey, TKeysSelection as TKeys } from 'Controls/interface/';


const ALL_SELECTION_VALUE = null;
const FIELD_ENTRY_PATH = 'ENTRY_PATH';

interface IEntryPath {
   id: String|number|null,
   parent: String|number|null
}

export function isNode(item: Record, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): boolean {
   if (model instanceof TreeCollection) {
      return model.getItemBySourceId(item.getId()).isNode();
   } else {
      return hierarchyRelation.isNode(item) !== null;
   }
};

export function isHasChildren(item: Record, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): boolean {
   if (model instanceof TreeCollection) {
      return model.getItemBySourceId(item.getId()).isHasChildren();
   } else {
      return hierarchyRelation.hasDeclaredChildren(item) !== false;
   }
};

export function getParentProperty(model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): string {
   if (model instanceof TreeCollection) {
      return model.getParentProperty();
   } else {
      return hierarchyRelation.getParentProperty();
   }
};

export function getItems(model: ListViewModel|Collection): RecordSet|List {
   if (model instanceof Collection) {
      return model.getCollection();
   } else {
      return model.getItems();
   }
};

export function getChildren(nodeId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): Array<Record> {
   let children: Array<Record> = [];

   if (model instanceof TreeCollection) {
      // Корня может и не быть в коллекции, поэтому ищем сами
      let parentProperty: string = model.getParentProperty();

      model.getCollection().forEach((item) => {
         if (item.get(parentProperty) === nodeId) {
            children.push(item);
         }
      });
   } else {
      children = hierarchyRelation.getChildren(nodeId, getItems(model));
   }

   return children;
};

// Возвращает кол-во выбранных записей в папке, идет в глубь(deep !== false) до первого исключения
export function getSelectedChildrenCount(nodeId: Tkey, selectedKeys: Tkeys, excludedKeys: Tkeys, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy, deep: boolean): number|null {
   let countSelectedChildren: number|null = 0;
   let nodeItem: Record = getItems(model).getRecordById(nodeId);
   let children: Array<Record> = getChildren(nodeId, model, hierarchyRelation);

   if (children.length) {
      for (let index = 0; index < children.length; index++) {
         let childItem: Record = children[index];
         let childId: Tkey = childItem.getId();

         if (!excludedKeys.includes(childId)) {
            countSelectedChildren++;

            if (isNode(childItem, model, hierarchyRelation) && isHasChildren(childItem, model, hierarchyRelation) && deep !== false) {
               let countSelectedChildren2: number|null = getSelectedChildrenCount(childId, selectedKeys, excludedKeys, model, hierarchyRelation);

               if (countSelectedChildren2 === null) {
                  countSelectedChildren = null;
                  break;
               } else {
                  countSelectedChildren += countSelectedChildren2;
               }
            }
         }
      }
   } else if (!nodeItem || isHasChildren(nodeItem, model, hierarchyRelation)) {
      countSelectedChildren = null;
   }

   return countSelectedChildren;
};

export function hasSelectedParent(key: Tkey, selectedKeys: Tkeys, excludedKeys: Tkeys, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): boolean {
   let
      hasSelectedParent: boolean = false,
      hasExcludedParent: boolean = false,
      currentParentId: Tkey|undefined = getParentId(key, model, hierarchyRelation);

   for (;currentParentId; currentParentId = getParentId(currentParentId, model, hierarchyRelation)) {
      if (selectedKeys.includes(currentParentId)) {
         hasSelectedParent = true;
         break;
      } else if (excludedKeys.includes(currentParentId)) {
         hasExcludedParent = true;
         break;
      }
   }

   if (!hasExcludedParent && !currentParentId && selectedKeys.includes(ALL_SELECTION_VALUE)) {
      hasSelectedParent = true;
   }

   return hasSelectedParent;
};

export function getParentId(itemId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): TKey|undefined {
   let parentProperty: string = getParentProperty(model, hierarchyRelation);
   let item: Record|undefined = getItems(model).getRecordById(itemId);

   return item && item.get(parentProperty);
};

export function getChildrenIds(nodeId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): Tkeys {
   let entriesPath: Array<IEntryPath> = getItems(model).getMetaData()[FIELD_ENTRY_PATH];
   let childrenIds: TKeys = getAllChildren(nodeId, model, hierarchyRelation).map((child) => {
      return child.getId();
   });

   if (entriesPath) {
      entriesPath.forEach((entryPath) => {
         if ((childrenIds.includes(entryPath.parent) || nodeId === entryPath.parent) && !childrenIds.includes(entryPath.id)) {
            childrenIds.push(entryPath.id);
            childrenIds = childrenIds.concat(getChildrenInEntryPath(entryPath.id, entriesPath));
         }
      });
   }

   return childrenIds;
};

export function getChildrenInEntryPath(parentId: Tkey, entriesPath: Array<IEntryPath>): Tkeys {
   let children = [];

   entriesPath.forEach((entryPath: IEntryPath) => {
      if (entryPath.parent === parentId) {
         children.push(entryPath.id);
         children = children.concat(getChildrenInEntryPath(entryPath.id, entriesPath));
      }
   });

   return children;
};

export function getAllChildren(nodeId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): Array<T> {
   let children: Array<Record> = [];

   getChildren(nodeId, model, hierarchyRelation).forEach((child) => {
      ArraySimpleValuesUtil.addSubArray(children, [child]);

      if (isNode(child, model, hierarchyRelation)) {
         ArraySimpleValuesUtil.addSubArray(children, getAllChildren(child.getId(), model, hierarchyRelation));
      }
   });

   return children;
};

export function hasChildrenInList(itemId: Tkey, listKeys: Tkeys, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): boolean {
   let hasChildren: boolean = false;
   let children: Array<Record> = getChildren(itemId, model, hierarchyRelation);

   for (let index = 0; index < children.length; index++) {
      let child: Record = children[index];
      let childrenId: Tkey = child.getId();

      if (listKeys.includes(childrenId) || isNode(child, model, hierarchyRelation) &&
         hasChildrenInList(childrenId, listKeys, model, hierarchyRelation)) {

         hasChildren = true;
         break;
      }
   }

   return hasChildren;
};

export function removeSelectionChildren(nodeId, selectedKeys, excludedKeys, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): void {
   let childrenIds: TKeys = getChildrenIds(nodeId, model, hierarchyRelation);

   ArraySimpleValuesUtil.removeSubArray(selectedKeys, childrenIds);
   ArraySimpleValuesUtil.removeSubArray(excludedKeys, childrenIds);
};
