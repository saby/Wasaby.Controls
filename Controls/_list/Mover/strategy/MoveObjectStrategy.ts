import {TKeysSelection} from 'Controls/interface';
import {IMoveStrategy} from '../interface/IMoveStrategy';

export interface IMoveItemsParams {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    filter: object;
}

export class MoveObjectStrategy implements IMoveStrategy<IMoveItemsParams> {
    moveItems(items: IMoveItemsParams, target, position): Promise<any> {
        const self = this;
        if (items.selectedKeys.length) {
            return _private.moveItems(self, items, target, position);
        }
        return Promise.resolve();
    }
}
