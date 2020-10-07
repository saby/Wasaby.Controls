import Flat from './Flat';
import { IDragPosition } from 'Controls/display';
import { IDraggableCollection, IDraggableItem, IDragStrategyParams, IOffset } from '../interface';

const DRAG_MAX_OFFSET = 10;

interface IDraggableTreeItem extends IDraggableItem {
    isNode(): boolean;
}

export interface ITreeDragStrategyParams extends IDragStrategyParams<IDraggableTreeItem> {
    mouseOffsetInTargetItem: IOffset;
}

interface IDraggableTreeCollection extends IDraggableCollection {
    getPrevDragPosition(): IDragPosition<IDraggableTreeItem>;
}

export default class Tree extends Flat<IDraggableTreeItem, ITreeDragStrategyParams> {
    protected _draggableItem: IDraggableTreeItem;
    protected _model: IDraggableTreeCollection;

    calculatePosition(
        {currentPosition, targetItem, mouseOffsetInTargetItem}: ITreeDragStrategyParams
    ): IDragPosition<IDraggableTreeItem> {
        if (this._draggableItem && this._draggableItem === targetItem) {
            return this._model.getPrevDragPosition() || null;
        }

        let result;

        if (targetItem && targetItem.isNode()) {
            result = this._calculatePositionRelativeNode(targetItem, mouseOffsetInTargetItem);
        } else {
            result = super.calculatePosition({currentPosition, targetItem});
        }

        return result;
    }

    private _calculatePositionRelativeNode(
        targetItem: IDraggableTreeItem, mouseOffsetInTargetItem: IOffset
    ): IDragPosition<IDraggableTreeItem> {
        let relativePosition;
        // Если перетаскиваем лист на узел, то позиция может быть только 'on'
        // Если нет перетаскиваемого элемента, то значит мы перетаскивам в папку другого реестра
        if (!this._draggableItem || !this._draggableItem.isNode() && targetItem.isNode()) {
            relativePosition = 'on';
        } else {
            if (mouseOffsetInTargetItem) {
                if (mouseOffsetInTargetItem.top <= DRAG_MAX_OFFSET) {
                    relativePosition = 'before';
                } else if (mouseOffsetInTargetItem.bottom <= DRAG_MAX_OFFSET) {
                    relativePosition = 'after';
                } else {
                    relativePosition = 'on';
                }
            }
        }

        return {
            index: this._model.getIndex(targetItem),
            position: relativePosition,
            dispItem: targetItem
        };
    }
}
