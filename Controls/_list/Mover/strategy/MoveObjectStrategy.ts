import {TKeySelection, TKeysSelection} from 'Controls/interface';
import {IMoveStrategy, BEFORE_ITEMS_MOVE_RESULT, MOVE_POSITION, IMoveObject} from '../interface/IMoveStrategy';
import {BaseStrategy} from './BaseStrategy';
import {Record} from "Types/entity";
import {DataSet} from "Types/source";
import {IMovableItem} from "../interface/IMovableItem";
import {TemplateFunction} from "UI/Base";

export class MoveObjectStrategy extends BaseStrategy implements IMoveStrategy<IMoveObject> {
    moveItems(items: IMoveObject, target: IMovableItem, position: MOVE_POSITION): Promise<DataSet|void> {
        if (items.selectedKeys.length) {
            return this._moveItemsInner(items, target, position);
        }
        return Promise.resolve();
    }

    /**
     * Перемещает элементы при помощи диалога
     * @param items
     * @param template
     */
    moveItemsWithDialog(items: IMoveObject, template: TemplateFunction): void {
        this._openMoveDialog(items, template);
    }

    /**
     * Возвращает выбранные ключи
     * @param items
     */
    protected _getSelectedKeys(items: IMoveObject): TKeysSelection {
        return items.selectedKeys;
    }

    /**
     * Обработчик Промиса после выполнения _beforeItemsMove
     * @param items
     * @param targetId
     * @param position
     * @param result
     * @private
     */
    protected _beforeItemsMoveResultHandler(items, targetId, position, result): Promise<DataSet|void> {
        if (result !== BEFORE_ITEMS_MOVE_RESULT.CUSTOM) {
            return this._moveInSource(items, targetId, position);
        }
        Promise.resolve();
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
