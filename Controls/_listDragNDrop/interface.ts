import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';
import { IDragPosition } from 'Controls/display';
import { IFlatDragStrategyParams } from './strategies/Flat';

export type TPosition = 'after'|'before'|'on';

export interface IDraggableItem<S extends Model = Model> {
   getContents(): S;
}

export interface IDraggableCollection<
   S extends Model = Model,
   T extends IDraggableItem<S> = IDraggableItem<S>,
   A = IDragPosition<T>
> {
   getIndexBySourceItem(item: S): number;

   setDragPosition(position: A): void;
   setDraggedItems(draggedItemKey: CrudEntityKey, draggedItemKeys: CrudEntityKey[]): void;
   resetDraggedItems(): void;
}

export interface IDragStrategyParams<T extends IDraggableItem = IDraggableItem> {
   targetItem: T;
}

/**
 * Интерфей стратегии перетаскивания элементов
 * @template P Тип параметров метода calculateDragPosition
 * @template A Тип объекта, обозначающего позицию
 * @template T Тип элемента коллекции
 * @public
 */
export interface IDragStrategy<
    A,
    T extends IDraggableItem = IDraggableItem,
    P extends IDragStrategyParams<T> = IDragStrategyParams<T>,
> {
   calculatePosition(params: P): A;
}

export abstract class BaseDragStrategy<
    A,
    T extends IDraggableItem,
    P extends IDragStrategyParams<T>
> implements IDragStrategy<A, T, P> {
   protected _draggableItem: T;
   protected _model: IDraggableCollection;

   constructor(model: IDraggableCollection, draggableItem: T) {
      this._model = model;
      this._draggableItem = draggableItem;
   }

   abstract calculatePosition(params: P): A;
}
