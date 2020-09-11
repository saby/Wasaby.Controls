import { CollectionItem, IBaseCollection } from 'Controls/display';
import { Model } from 'Types/entity';

export type TVisibility = 'visible' | 'hidden' | 'onactivated';
export enum Visibility { Visible = 'visible', Hidden = 'hidden', OnActivated = 'onactivated'}
export type TKey = string|number;

export interface IMarkerModel extends IBaseCollection<Model, CollectionItem<Model>> {
   setMarkedKey(key: TKey, status: boolean): void;
   getFirstItem(): Model;
   getCount(): number;
   getValidItemForMarker(index: number): CollectionItem<Model>;
   getStartIndex(): number;
   getStopIndex(): number;

   getItemBySourceKey(key: TKey): CollectionItem<Model>;

   getIndex(item: CollectionItem<Model>): number;
}

export interface IOptions {
   model: IMarkerModel;
   markerVisibility: TVisibility;
   markedKey?: TKey;
}
