import {TKeysSelection} from 'Controls/interface';
import {IMoveStrategy, BEFORE_ITEMS_MOVE_RESULT} from '../interface/IMoveStrategy';
import {BaseStrategy, MOVE_POSITION} from './BaseStrategy';
import {RecordSet} from "Types/collection";
import {Record} from "Types/entity";

export interface IMoveItemsParams {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    filter: object;
}

export class MoveObjectStrategy extends BaseStrategy implements IMoveStrategy<IMoveItemsParams> {
    moveItems(items: IMoveItemsParams, target, position): Promise<any> {
        if (items.selectedKeys.length) {
            return this.moveItemsInner(items, target, position);
        }
        return Promise.resolve();
    }

    protected _beforeItemsMoveResultHandler(items, target, position, result): Promise<void> {
        if (result !== BEFORE_ITEMS_MOVE_RESULT.CUSTOM) {
            return this._moveInSource(items, target, position);
        }
        Promise.resolve();
    }

    protected _moveInSource(items: IMoveItemsParams, target, position: MOVE_POSITION) {
        const targetId = this._getIdByItem(target);
        if (this._source.call) {
            return import('Controls/operations').then((operations) => {
                const sourceAdapter = this._source.getAdapter();
                const callFilter = {
                    selection: operations.selectionToRecord({
                        selected: items.selectedKeys,
                        excluded: items.excludedKeys
                    }, sourceAdapter), ...items.filter
                };
                return this._source.call(this._source.getBinding().move, {
                    method: this._source.getBinding().list,
                    filter: Record.fromObject(callFilter, sourceAdapter),
                    folder_id: targetId
                });
            });
        }
        return this._source.move(items.selectedKeys, targetId, {
            position,
            parentProperty: self._options.parentProperty
        });
    }
}
