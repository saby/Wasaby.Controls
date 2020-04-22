import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { relation } from 'Types/entity';
import { Tree as TreeCollection } from 'Controls/display';
import { ViewModel } from 'Controls/treeGrid';
import { TKeysSelection as TKeys, ISelectionObject as ISelection, TSelectedKey as TKey } from 'Controls/interface';
import getChildrenIds from './getChildrenIds';

export default function removeSelectionChildren(selection: ISelection, nodeId: TKey, model: ViewModel|TreeCollection, hierarchyRelation: relation.Hierarchy): void {
   const childrenIds: TKeys = getChildrenIds(nodeId, model, hierarchyRelation);

   ArraySimpleValuesUtil.removeSubArray(selection.selected, childrenIds);
   ArraySimpleValuesUtil.removeSubArray(selection.excluded, childrenIds);
}
