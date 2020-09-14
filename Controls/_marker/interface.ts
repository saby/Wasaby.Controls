import { Collection, CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

export type TVisibility = 'visible' | 'hidden' | 'onactivated';
export enum Visibility { Visible = 'visible', Hidden = 'hidden', OnActivated = 'onactivated'}

export interface IOptions {
   model: Collection<Model, CollectionItem<Model>>;
   markerVisibility: TVisibility;
   markedKey?: CrudEntityKey;
}
