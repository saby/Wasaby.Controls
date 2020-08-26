import {TemplateFunction} from 'UI/Base';
import {Model} from 'Types/entity';
import {DataSet} from 'Types/source';
import {RecordSet} from 'Types/collection';
import { Dialog } from 'Controls/popup';
import * as InstanceChecker from 'Core/core-instance';

import {
    BEFORE_ITEMS_MOVE_RESULT,
    IStrategyOptions,
    MOVE_POSITION,
    TMoveItem,
    TMoveItems
} from '../interface/IMoveStrategy';
import {IMovableItem} from '../interface/IMovableItem';
import {TKeySelection, TKeysSelection} from 'Controls/interface';
import {ISource} from '../interface/IMoveStrategy';

export abstract class BaseStrategy {

    protected _parentProperty: string;

    protected _nodeProperty: string;

    protected _sortingOrder: string;

    protected _source: ISource;

    protected _filter: any;

    protected _items: RecordSet;

    protected _keyProperty: string;

    protected _searchParam: string;

    protected _moveDialogOptions: any;

    protected _root: string;

    // @todo implement in control
    // @todo Как сделать без колбеков??
    _beforeItemsMove: (items: TMoveItems, target: IMovableItem, position: MOVE_POSITION) => Promise<any>;
    _afterItemsMove: (items: TMoveItems, target, position: MOVE_POSITION, result) => void;

    constructor(options: IStrategyOptions) {
        this._parentProperty = options.parentProperty;
        this._nodeProperty = options.nodeProperty;
        this._sortingOrder = options.sortingOrder;
        this._source = options.source;
        this._filter = options.filter;
        this._items = options.items;
        this._keyProperty = options.keyProperty;
        this._searchParam = options.searchParam;
        this._moveDialogOptions = options.moveDialogOptions;
        this._root = options.root;
    }

    abstract moveItems(items: TMoveItems, target: IMovableItem, position: MOVE_POSITION): Promise<DataSet|void>;

    protected abstract _beforeItemsMoveResultHandler(items: TMoveItems, target: IMovableItem, position: MOVE_POSITION, result: BEFORE_ITEMS_MOVE_RESULT): Promise<DataSet|void>;

    protected abstract _moveInSource(items: TMoveItems, targetId: TKeySelection, position: MOVE_POSITION): Promise<DataSet|void>;

    protected abstract _getSelectedKeys(items: TMoveItems): TKeysSelection;

    // TODO Надо понять, может ли контроллер работать с Collection и тогда может быть этот метот сократится
    getSiblingItem(item: TMoveItem, position: MOVE_POSITION) {
        let itemIndex = this._items.getIndex(this.getModel(item));
        return this._items.at(position === MOVE_POSITION.before ? --itemIndex : ++itemIndex);
    }

    /**
     * Получает модель по item
     * Item может быть или Model или ключом
     * Еслит ключ, то идёт попытка получить модель из списка _items
     * @param item
     */
    getModel(item: Model|TKeySelection): Model {
        return InstanceChecker.instanceOfModule(item, 'Types/entity:Model') ? item as Model : this._items.getRecordById(item as TKeySelection);
    }

    /**
     * Получает ключ по item
     * Item может быть или Model или ключом
     * Еслит Model, то идёт попытка получить ключ по _keyProperty
     * @param item
     */
    getId(item: Model|TKeySelection): TKeySelection {
        return InstanceChecker.instanceOfModule(item, 'Types/entity:Model') ? (item as Model).get(this._keyProperty) : item as TKeySelection;
    }

    /**
     * Общий код стратегии, выполняющийся при перемещении элементов
     * @param items
     * @param target
     * @param position
     * @private
     */
    protected _moveItemsInner(
        items: TMoveItems,
        target: IMovableItem,
        position: MOVE_POSITION): Promise<any> {
        const both = (result) => {
            this._afterItemsMove(items, target, position, result);
            return result;
        }
        return this._beforeItemsMove(items, target, position)
            .then((beforeItemsMoveResult: BEFORE_ITEMS_MOVE_RESULT) => {
                return this._beforeItemsMoveResultHandler(items, target?.getContents()?.getKey(), position, beforeItemsMoveResult)
                    .then((result) => both(result));
            })
            .catch((result: BEFORE_ITEMS_MOVE_RESULT) => both(result));
    }

    /**
     * Открывает диалог перемещения
     * @param items
     * @param template
     * @private
     */
    protected _openMoveDialog(items: TMoveItems, template: TemplateFunction): void {
        const templateOptions = {
            movedItems: this._getSelectedKeys(items),
            source: this._source,
            keyProperty: this._keyProperty,
            ...this._moveDialogOptions
        };

        Dialog.openPopup({
            templateOptions,
            closeOnOutsideClick: true,
            template,
            eventHandlers: {
                onResult: (target): void => {
                    this.moveItems(items, target, MOVE_POSITION.on);
                }
            }
        });
    }
}
