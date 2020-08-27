import {Record} from 'Types/entity';
import {BindingMixin, DataSet, ICrudPlus, IData, IRpc} from 'Types/source';

import {TKeySelection, TKeysSelection} from 'Controls/interface';
import {
    IMoveStrategy,
    MOVE_TYPE,
    MOVE_POSITION, TMoveItems
} from '../interface/IMoveStrategy';
import {BaseStrategy} from './BaseStrategy';
import {IMoveObject} from '../interface/IMoveObject';

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
    getItems(items: IMoveObject): Promise<IMoveObject> {
        return Promise.resolve(items);
    }

    /**
     * Возвращает выбранные ключи
     * @param items
     */
    getSelectedKeys(items: IMoveObject): TKeysSelection {
        return items.selectedKeys;
    }

    /**
     * Перемещает элементы в ресурсе
     * @param items
     * @param targetId
     * @param position
     * @private
     */
    protected _moveInSource(items: IMoveObject, targetId: TKeySelection, position: MOVE_POSITION): Promise<DataSet|void>  {
        if ((this._source as IRpc).call) {
            return import('Controls/operations').then((operations) => {
                const sourceAdapter = (this._source as IData).getAdapter();
                const callFilter = {
                    selection: operations.selectionToRecord({
                        selected: items.selectedKeys,
                        excluded: items.excludedKeys
                    }, sourceAdapter), ...items.filter
                };
                return (this._source as IRpc).call((this._source as BindingMixin).getBinding().move, {
                    method: (this._source as BindingMixin).getBinding().list,
                    filter: Record.fromObject(callFilter, sourceAdapter),
                    folder_id: targetId
                });
            });
        }
        return (this._source as ICrudPlus).move(items.selectedKeys, targetId, {
            position,
            parentProperty: this._parentProperty
        });
    }
}
