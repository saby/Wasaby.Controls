import { Tree as TreeCollection } from 'Controls/display';
import { isNode, isHasChildren, getItems, getChildren } from 'Controls/_operations/MultiSelector/ModelCompability';

import { relation, Record } from 'Types/entity';
import { RecordSet, List } from 'Types/collection';
// @ts-ignore
import { ViewModel } from 'Controls/treeGrid';
import {ISelectionObject as ISelection } from 'Controls/interface';

// Возвращает кол-во выбранных записей в папке, идет в глубь(deep !== false) до первого исключения
export default function getSelectedChildrenCount(nodeId: Tkey, selection: ISelection, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy, deep: boolean): number|null {
   const nodeItem = getItems(model).getRecordById(nodeId);
   const children = getChildren(nodeId, model, hierarchyRelation);
   let selectedChildrenCount = 0;

   if (children.length) {
      let childId;
      let childNodeSelectedCount;

      children.forEach((childItem) => {
         if (selectedChildrenCount !== null) {
            childId = childItem.getId();

            if (!selection.excluded.includes(childId)) {
               if (!selection.selected.includes(childId)) {
                  selectedChildrenCount++;
               }

               if (isNode(childItem, model, hierarchyRelation) && isHasChildren(childItem, model, hierarchyRelation) && deep !== false) {
                  childNodeSelectedCount = getSelectedChildrenCount(childId, selection, model, hierarchyRelation);

                  if (childNodeSelectedCount === null) {
                     selectedChildrenCount = null;
                  } else {
                     selectedChildrenCount += childNodeSelectedCount;
                  }
               }
            }
         }
      });
   } else if (!nodeItem || isHasChildren(nodeItem, model, hierarchyRelation)) {
      selectedChildrenCount = null;
   }

   return selectedChildrenCount;
};
