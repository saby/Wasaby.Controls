import { relation } from 'Types/entity';
import { Record} from 'Types/entity';
import { TKeySelection as TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';

export function getChildren(nodeId: TKey, items: RecordSet, hierarchyRelation: relation.Hierarchy): Record[] {
   return hierarchyRelation.getChildren(nodeId, items);;
}
