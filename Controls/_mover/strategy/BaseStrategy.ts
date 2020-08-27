import {Model} from 'Types/entity';
import {DataSet} from 'Types/source';
import {RecordSet} from 'Types/collection';
import * as InstanceChecker from 'Core/core-instance';

import {
    IStrategyOptions,
    MOVE_POSITION,
    TMoveItem,
    TMoveItems
} from '../interface/IMoveStrategy';
import {TKeySelection} from 'Controls/interface';
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

    protected _root: string;

    constructor(options: IStrategyOptions) {
        this._parentProperty = options.parentProperty;
        this._nodeProperty = options.nodeProperty;
        this._sortingOrder = options.sortingOrder;
        this._source = options.source;
        this._filter = options.filter;
        this._items = options.items;
        this._keyProperty = options.keyProperty;
        this._searchParam = options.searchParam;
        this._root = options.root;
    }

    abstract moveItems(items: TMoveItems, targetId: TKeySelection, position: MOVE_POSITION, moveType?: string): Promise<DataSet|void>;

    protected abstract _moveInSource(items: TMoveItems, targetId: TKeySelection, position: MOVE_POSITION): Promise<DataSet|void>;

    getSiblingItem(item: TMoveItem, position: MOVE_POSITION): Model {
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
}
