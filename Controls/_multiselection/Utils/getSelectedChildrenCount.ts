import { relation, Record } from 'Types/entity';
import { TKeySelection as TKey, ISelectionObject as ISelection } from 'Controls/interface';
import { getChildren } from './utils';
import { RecordSet } from 'Types/collection';

function isHasChildren(item: Record, hierarchyRelation: relation.Hierarchy): boolean {
   return hierarchyRelation ? hierarchyRelation.hasDeclaredChildren(item) !== false : false;
}

export default function getSelectedChildrenCount(
   nodeId: TKey,
   selection: ISelection,
   items: RecordSet,
   hierarchyRelation: relation.Hierarchy,
   deep?: boolean
): number|null {
   const nodeItem = items.getRecordById(nodeId);
   const children = getChildren(nodeId, items, hierarchyRelation);
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

               if (hierarchyRelation.isNode(childItem) && isHasChildren(childItem, hierarchyRelation) && deep !== false) {
                  childNodeSelectedCount = getSelectedChildrenCount(childId, selection, items, hierarchyRelation);

                  if (childNodeSelectedCount === null) {
                     selectedChildrenCount = null;
                  } else {
                     selectedChildrenCount += childNodeSelectedCount;
                  }
               }
            }
         }
      });
   } else if (!nodeItem || isHasChildren(nodeItem, hierarchyRelation)) {
      selectedChildrenCount = null;
   }

   return selectedChildrenCount;
}
