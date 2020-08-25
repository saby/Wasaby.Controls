import {Model, Record} from "Types/entity";
import {IData} from 'Types/source';

import {IMoveItemsParams} from "./MoveObjectStrategy";
import {BEFORE_ITEMS_MOVE_RESULT} from "../interface/IMoveStrategy";

export enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
}

type TItems = Model[]|IMoveItemsParams;

export abstract class BaseStrategy {

    protected _parentProperty: string;

    protected _sortingOrder: string;

    protected _source: IData;

    protected _filter: any;

    _beforeItemsMove: (items: TItems, target, position: MOVE_POSITION) => Promise<any>;
    _afterItemsMove: (items: TItems, target, position: MOVE_POSITION, result) => void;

    protected abstract _beforeItemsMoveResultHandler(items: TItems, target, position: MOVE_POSITION, result: BEFORE_ITEMS_MOVE_RESULT): Promise<any>;

    protected moveItemsInner(
        items: TItems,
        target,
        position: MOVE_POSITION): Promise<any> {
        return this._beforeItemsMove(items, target, position)
            .then((result: BEFORE_ITEMS_MOVE_RESULT) => this._beforeItemsMoveResultHandler(items, target, position, result))
            .finally((result) => {
                this._afterItemsMove(items, target, position, result);
                return result;
            });
    }


}
