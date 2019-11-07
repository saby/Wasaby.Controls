import { relation } from 'Types/entity';
import { Collection, Tree as TreeCollection } from 'Controls/display';
import { ListViewModel } from 'Controls/list';
import { ViewModel } from 'Controls/treeGrid';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/_interface/ISelectionType';

export interface IFlatSelectionStrategy {
   select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection;
   unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys): ISelection;
   getCount(selectedKeys: TKeys, excludedKeys: TKeys, model: Collection|ListViewModel, limit: number): Promise;
   getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model: Collection|ListViewModel, keyProperty: string, limit: number): Map<TKey, boolean>;
   isAllSelected(selectedKeys: TKeys): boolean;
}

// параметр hierarchyRelation нужен для поддержки старой модели, с полным переходом на новую он уйдет
export interface ITreeSelectionStrategy {
   select(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation?: relation.Hierarchy): ISelection;
   unSelect(keys: TKeys, selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation?: relation.Hierarchy): ISelection;
   getCount(selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation?: relation.Hierarchy): Promise;
   getSelectionForModel(selectedKeys: TKeys, excludedKeys: TKeys, model: TreeCollection|ViewModel, hierarchyRelation?: relation.Hierarchy): Map<TKey, boolean|null>;
   isAllSelected(nodeId: Tkey, selectedKeys: TKeys, excludedKeys: TKeys): boolean;
}
