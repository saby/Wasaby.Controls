import { CollectionItem, IBaseCollection } from 'Controls/display';
import { Model, relation } from 'Types/entity';
import { TKeysSelection as TKeys, TSelectedKey as TKey} from 'Controls/interface';
import { default as ISelectionStrategy } from './SelectionStrategy/ISelectionStrategy';
import { RecordSet } from 'Types/collection';

export interface ISelectionModel extends IBaseCollection<CollectionItem<Model>> {
   getHasMoreData(): boolean;

   getRoot(): CollectionItem<Model>;

   getCollection(): RecordSet;

   setSelectedItems(items: Array<CollectionItem<Model>>, selected: boolean): void;
}

export interface ISelectionControllerOptions {
   model: ISelectionModel;
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   strategy?: ISelectionStrategy;
   strategyOptions?: ITreeSelectionStrategyOptions;
}

export interface ISelectionDifference {
   newKeys: TKeys;
   added: TKeys;
   removed: TKeys;
}

export interface ISelectionControllerResult {
   selectedKeysDiff: ISelectionDifference;
   excludedKeysDiff: ISelectionDifference;
   selectedCount: number;
   isAllSelected: boolean;
}

export interface ITreeSelectionStrategyOptions {
   selectAncestors: boolean;
   selectDescendants: boolean;
   nodesSourceControllers?: Object;
   hierarchyRelation: relation.Hierarchy;
   rootId: TKey;
   items: RecordSet;
}

export interface IFlatSelectionStrategyOptions {
   items: RecordSet;
}

export interface IEntryPath {
   id: TKey;
   parent: TKey;
}
