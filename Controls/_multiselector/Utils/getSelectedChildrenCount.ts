import { relation } from 'Types/entity';
import { TKeySelection as TKey, ISelectionObject as ISelection } from 'Controls/interface';
import { ISelectionModel } from '../interface';
import { getChildren, getItems, isHasChildren } from './utils';

export default function getSelectedChildrenCount(
   nodeId: TKey,
   selection: ISelection,
   model: ISelectionModel,
   hierarchyRelation: relation.Hierarchy,
   deep: boolean
): number|null {
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
}