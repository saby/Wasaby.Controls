import { CollectionItem } from 'Controls/display';
import { Model, relation } from 'Types/entity';
import { TKeysSelection as TKeys, TKeySelection as TKey } from 'Controls/interface';
import { default as ISelectionStrategy } from './SelectionStrategy/ISelectionStrategy';
import { RecordSet } from 'Types/collection';

export interface ISelectionModel {
   getHasMoreData(): boolean;

   getCount(): number;

   getRoot(): any;

   getCollection(): RecordSet;

   setSelectedItems(items: Array<CollectionItem<Model>>, selected: boolean): void;

   getItemBySourceKey(key: string | number): CollectionItem<Model>;
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
}

export interface IEntryPath {
   id: string|number|null;
   parent: string|number|null;
}

// tslint:disable-next-line:no-empty-interface
export interface IFlatSelectionStrategyOptions {
   // is empty
}
