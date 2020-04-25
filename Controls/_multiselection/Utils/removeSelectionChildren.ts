import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { relation } from 'Types/entity';
import { TKeysSelection as TKeys, ISelectionObject as ISelection, TSelectedKey as TKey } from 'Controls/interface';
import getChildrenIds from './getChildrenIds';
import { RecordSet } from 'Types/collection';

export default function removeSelectionChildren(selection: ISelection, nodeId: TKey, items: RecordSet, hierarchy: relation.Hierarchy): void {
   const childrenIds: TKeys = getChildrenIds(nodeId, items, hierarchy);

   ArraySimpleValuesUtil.removeSubArray(selection.selected, childrenIds);
   ArraySimpleValuesUtil.removeSubArray(selection.excluded, childrenIds);
}
