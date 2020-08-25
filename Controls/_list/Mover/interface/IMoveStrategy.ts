import {TKeySelection} from 'Controls/interface';
import {MOVE_POSITION} from "../strategy/BaseStrategy";

export enum BEFORE_ITEMS_MOVE_RESULT {
    CUSTOM = 'Custom',
    MOVE_IN_ITEMS = 'MoveInItems'
}

export interface IMoveStrategy<T> {
    movedItems(): TKeySelection;
    moveItems(items: T, target, position): Promise<any>
    _beforeItemsMoveResultHandler(items: T, target, position: MOVE_POSITION, result: BEFORE_ITEMS_MOVE_RESULT): Promise<any>;
    _moveInSource(items: T, target, position: MOVE_POSITION)
}
