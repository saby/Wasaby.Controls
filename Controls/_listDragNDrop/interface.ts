import { IDragPosition } from 'Controls/display';
import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';

export type TPosition = 'after'|'before'|'on';

export interface IOffset {
   top: number;
   bottom: number;
}

export interface IDraggableItem<S extends Model = Model> {
   getContents(): S;
}

export interface IDraggableCollection<
   S extends Model = Model,
   T extends IDraggableItem<S> = IDraggableItem<S>
> {
   getIndexBySourceItem(item: S): number;
   getIndex(item: T): number;

   setDragPosition(position: IDragPosition<T>): void;
   setDraggedItems(draggedItemKey: CrudEntityKey, draggedItemKeys: CrudEntityKey[]): void;
   resetDraggedItems(): void;
}

export interface IDragStrategyParams<T extends IDraggableItem = IDraggableItem> {
   targetItem: T;
}

export interface IDragStrategy<
    T extends IDraggableItem = IDraggableItem,
    P extends IDragStrategyParams<T> = IDragStrategyParams<T>
> {
   calculatePosition(params: P): IDragPosition<T>;
}
