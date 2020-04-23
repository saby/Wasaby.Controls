import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { relation } from 'Types/entity';
import { TKeySelection as TKey, TSelectedKeys as TKeys } from 'Controls/interface';
import { Model } from 'Types/entity';
import { getChildren, isNode } from './utils';
import { IEntryPath, ISelectionModel } from '../interface';

const FIELD_ENTRY_PATH = 'ENTRY_PATH';

function getAllChildren(nodeId: TKey, model: ISelectionModel, hierarchyRelation: relation.Hierarchy): Model[] {
   const children: Model[] = [];

   getChildren(nodeId, model, hierarchyRelation).forEach((child) => {
      ArraySimpleValuesUtil.addSubArray(children, [child]);

      if (isNode(child, model, hierarchyRelation)) {
         ArraySimpleValuesUtil.addSubArray(children, getAllChildren(child.getId(), model, hierarchyRelation));
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

export default function getChildrenIds(nodeId: TKey, model: ISelectionModel, hierarchyRelation: relation.Hierarchy): TKeys {
   const entriesPath = model.getCollection().getMetaData()[FIELD_ENTRY_PATH];
   let childrenIds = getAllChildren(nodeId, model, hierarchyRelation).map((child) => {
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
