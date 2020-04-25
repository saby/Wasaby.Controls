import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { relation } from 'Types/entity';
import { TKeySelection as TKey, TSelectedKeys as TKeys } from 'Controls/interface';
import { Model } from 'Types/entity';
import { getChildren } from './utils';
import { IEntryPath } from '../interface';
import { RecordSet } from 'Types/collection';

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

function getAllChildren(nodeId: TKey, items: RecordSet, hierarchyRelation: relation.Hierarchy): Model[] {
   const children: Model[] = [];

   getChildren(nodeId, items, hierarchyRelation).forEach((child) => {
      ArraySimpleValuesUtil.addSubArray(children, [child]);

      if (hierarchyRelation.isNode(child)) {
         ArraySimpleValuesUtil.addSubArray(children, getAllChildren(child.getId(), items, hierarchyRelation));
      }
   });

   return children;
}

function getChildrenInEntryPath(parentId: TKey, entriesPath: IEntryPath[]): TKeys {
   let children = [];

   entriesPath.forEach((entryPath: IEntryPath) => {
      if (entryPath.parent === parentId) {
         children.push(entryPath.id);
         children = children.concat(getChildrenInEntryPath(entryPath.id, entriesPath));
      }
   });

   return children;
}

export default function getChildrenIds(nodeId: TKey, items: RecordSet, hierarchyRelation: relation.Hierarchy): TKeys {
   const entriesPath = items.getMetaData()[FIELD_ENTRY_PATH];
   let childrenIds = getAllChildren(nodeId, items, hierarchyRelation).map((child) => {
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
}
