import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';
import { IDragPosition } from 'Controls/display';

/**
 * Тип позиции, которая указывает куда вставляется элемент относительно элемента, на который навели
 * @type Controls/_listDragNDrop/interface#TPosition
 * @public
 * @author Панихин К.А.
 */
export type TPosition = 'after'|'before'|'on';

/**
 * Интерфейс перетаскиваемого элемента
 * @interface Controls/_listDragNDrop/interface#IDraggableItem
 * @template S Тип содержимого элемента
 * @public
 * @author Панихин К.А.
 */
export interface IDraggableItem<S extends Model = Model> {
   getContents(): S;
   setDragged(state: boolean): void;
   setVisible(state: boolean): void;
}

/**
 * Интерфейс коллекции с возможностью перетаскивания записей
 * @interface Controls/_listDragNDrop/interface#IDraggableCollection
 * @template A Тип объекта, обозначающего позицию
 * @template T Тип элемента коллекции
 * @public
 * @author Панихин К.А.
 */
export interface IDraggableCollection<
   T extends IDraggableItem = IDraggableItem,
   A = IDragPosition<T>
> {
   setDragPosition(position: A): void;
   setDraggedItems(draggedItemKey: CrudEntityKey, draggedItemKeys: CrudEntityKey[]): void;
   resetDraggedItems(): void;
}

/**
 * Интерфейс параметра основного метода стратегии перетаскивания
 * @interface Controls/_listDragNDrop/interface#IDragStrategyParams
 * @template T Тип элемента коллекции
 * @public
 * @author Панихин К.А.
 */
export interface IDragStrategyParams<T extends IDraggableItem = IDraggableItem> {
   targetItem: T;
}

/**
 * Интерфейс стратегии перетаскивания
 * @interface Controls/_listDragNDrop/interface#IDragStrategy
 * @template A Тип объекта, обозначающего позицию
 * @template T Тип элемента коллекции
 * @template C Тип коллекции
 * @template P Тип параметра метода calculateDragPosition
 * @public
 * @author Панихин К.А.
 */
export interface IDragStrategy<
    A,
    T extends IDraggableItem = IDraggableItem,
    C extends IDraggableCollection<T, A> = IDraggableCollection<T, A>,
    P extends IDragStrategyParams<T> = IDragStrategyParams<T>,
> {
   calculatePosition(params: P): A;
}

/**
 * Базовый класс стратегии перетаскивания
 * @class Controls/_listDragNDrop/interface#BaseDragStrategy
 * @implements Controls/_listDragNDrop/interface#IDragStrategy
 * @template A Тип объекта, обозначающего позицию
 * @template T Тип элемента коллекции
 * @template C Тип коллекции
 * @template P Тип параметра метода calculateDragPosition
 * @public
 * @abstract
 * @author Панихин К.А.
 */
export abstract class BaseDragStrategy<
    A,
    T extends IDraggableItem = IDraggableItem,
    C extends IDraggableCollection<T, A> = IDraggableCollection<T, A>,
    P extends IDragStrategyParams<T> = IDragStrategyParams<T>,
> implements IDragStrategy<A, T, C, P> {
   protected _draggableItem: T;
   protected _model: C;

   protected constructor(model: C, draggableItem: T) {
      this._model = model;
      this._draggableItem = draggableItem;
   }

   abstract calculatePosition(params: P): A;
}
