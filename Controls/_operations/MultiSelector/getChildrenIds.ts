import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { isNode, getItems, getChildren } from 'Controls/_operations/MultiSelector/ModelCompability';

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

function getAllChildren(nodeId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): Array<T> {
   let children: Array<Record> = [];

   getChildren(nodeId, model, hierarchyRelation).forEach((child) => {
      ArraySimpleValuesUtil.addSubArray(children, [child]);

      if (isNode(child, model, hierarchyRelation)) {
         ArraySimpleValuesUtil.addSubArray(children, getAllChildren(child.getId(), model, hierarchyRelation));
      }
   });

   return children;
};

function getChildrenInEntryPath(parentId: Tkey, entriesPath: Array<IEntryPath>): Tkeys {
   let children = [];

   entriesPath.forEach((entryPath: IEntryPath) => {
      if (entryPath.parent === parentId) {
         children.push(entryPath.id);
         children = children.concat(getChildrenInEntryPath(entryPath.id, entriesPath));
      }
   });

   return children;
};

export default function getChildrenIds(nodeId: Tkey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): Tkeys {
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
