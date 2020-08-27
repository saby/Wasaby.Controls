import {Record} from 'Types/entity';
import {DataSet} from 'Types/source';

import {TKeySelection} from 'Controls/interface';
import {
    IMoveStrategy,
    MOVE_TYPE,
    MOVE_POSITION,
    IMoveObject,
    TMoveItems
} from '../interface/IMoveStrategy';
import {BaseStrategy} from './BaseStrategy';

export class MoveObjectStrategy extends BaseStrategy implements IMoveStrategy<IMoveObject> {
    moveItems(items: TMoveItems, targetId: TKeySelection, position: MOVE_POSITION, moveType?: string): Promise<DataSet|void> {
        if (items.selectedKeys.length && moveType !== MOVE_TYPE.CUSTOM) {
            return this._moveInSource(items, targetId, position);
        }
        return Promise.resolve();
    }

    /**
     * Метод, необходимый для получения совместимости со старой логикой.
     * @param items
     */
    getSelectedItems(items: TMoveItems): Promise<TMoveItems> {
        return Promise.resolve(items?.selectedKeys);
    }

    /**
     * Перемещает элементы в ресурсе
     * @param items
     * @param targetId
     * @param position
     * @private
     */
    protected _moveInSource(items: IMoveObject, targetId: TKeySelection, position: MOVE_POSITION): Promise<DataSet|void>  {
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
            parentProperty: this._parentProperty
        });
    }
}
