import { IDragPosition } from 'Controls/display';
import { IDraggableCollection, IDraggableItem, IDragStrategy, IDragStrategyParams, IOffset } from '../interface';

export interface IFlatDragStrategyParams<T extends IDraggableItem = IDraggableItem> extends IDragStrategyParams<T> {
    currentPosition: IDragPosition<T>;
}

export default class Flat<
    T extends IDraggableItem = IDraggableItem,
    P extends IFlatDragStrategyParams<T> = IFlatDragStrategyParams<T>
> implements IDragStrategy<T, P> {
    protected _draggableItem: T;
    protected _model: IDraggableCollection;
    protected _startPosition: IDragPosition<T>;

    constructor(model: IDraggableCollection, draggableItem: T) {
        this._model = model;
        this._draggableItem = draggableItem;

        // getIndexBySourceItem - т.к. draggableItem это avatar и его нет в коллекции
        this._startPosition = {
            index: this._model.getIndexBySourceItem(draggableItem.getContents()),
            position: 'before',
            dispItem: this._draggableItem
        };
    }

    calculatePosition({currentPosition, targetItem}: IFlatDragStrategyParams<T>): IDragPosition<T> {
        let prevIndex = -1;

        if (targetItem === null) {
            return this._startPosition;
        }

        // If you hover on a record that is being dragged, then the position should not change.
        if (this._draggableItem.getContents().getKey() === targetItem.getContents().getKey()) {
            return currentPosition;
        }

        if (currentPosition) {
            prevIndex = currentPosition.index;
        } else if (this._draggableItem) {
            prevIndex = this._startPosition.index;
        }

        let position;
        const targetIndex = this._model.getIndex(targetItem);
        if (prevIndex === -1) {
            position = 'before';
        } else if (targetIndex > prevIndex) {
            position = 'after';
        } else if (targetIndex < prevIndex) {
            position = 'before';
        } else if (targetIndex === prevIndex) {
            position = currentPosition.position === 'after' ? 'before' : 'after';
        }

        return {
            index: targetIndex,
            dispItem: targetItem,
            position
        };
    }
}
