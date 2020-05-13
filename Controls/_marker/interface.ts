import { CollectionItem, IBaseCollection } from 'Controls/display';
import { Model } from 'Types/entity';
import { TKeySelection as TKey } from 'Controls/interface';

export type TVisibility = 'visible' | 'hidden' | 'onactivated';
export enum Visibility { Visible = 'visible', Hidden = 'hidden', OnActivated = 'onactivated'}

export interface IMarkerModel extends IBaseCollection<CollectionItem<Model>> {
   setMarkedKey(key: TKey, status: boolean): void;
   getFirstItem(): Model;
   getPreviousItem(index: number): TKey;
   getNextItem(index: number): TKey;
   getPreviousItemKey(key: TKey): TKey;
   getNextItemKey(key: TKey): TKey;
   getCount(): number;
}

export interface IOptions {
   model: IMarkerModel;
   markerVisibility: TVisibility;
   markedKey: TKey;
}
