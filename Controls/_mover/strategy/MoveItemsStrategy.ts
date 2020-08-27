import {Model} from 'Types/entity';
import {DataSet} from 'Types/source';

// TODO Это похоже, только для дерева
import * as TreeItemsUtil from 'Controls/_list/resources/utils/TreeItemsUtil';

import * as getItemsBySelection from 'Controls/Utils/getItemsBySelection';
import {TKeySelection, TKeysSelection, TSelectionRecord} from 'Controls/interface';

import {
    IMoveStrategy,
    MOVE_TYPE,
    MOVE_POSITION,
    TMoveItems, TMoveItem
} from '../interface/IMoveStrategy';
import {BaseStrategy} from './BaseStrategy';


const DEFAULT_SORTING_ORDER = 'asc';

export class MoveItemsStrategy extends BaseStrategy implements IMoveStrategy<Model[]> {
    moveItems(items: TMoveItems, targetId: TKeySelection, position: MOVE_POSITION, moveType?: string): Promise<DataSet|void> {
        if (moveType === MOVE_TYPE.MOVE_IN_ITEMS) {
            this._moveInItems(items, targetId, position);
        } else if (moveType !== MOVE_TYPE.CUSTOM) {
            return this._moveInSource(items, targetId, position).then((moveResult) => {
                this._moveInItems(items, targetId, position);
                return moveResult;
            });
        }
        return Promise.resolve();
    }

    /**
     * Возвращает выделенные элементы
     * @param items
     * @param target
     * @param position
     * @private
     */
    getSelectedItems(items: TMoveItems, target?: Model, position?: MOVE_POSITION): Promise<TMoveItems> {
        if (!target && !position) {
            return this._getItemsBySelection(items);
        }
        return this._getItemsBySelection(items).then((itemsBySelection: TMoveItems) => (
            itemsBySelection.filter((item) => this._checkItem(item, target, position))
        ));
    }

    // TODO Это похоже, только для дерева
    getSiblingItem(item: TMoveItem, position: MOVE_POSITION): Model {
        //В древовидной структуре, нужно получить следующий(предыдущий) с учетом иерархии.
        //В рекордсете между двумя соседними папками, могут лежат дочерние записи одной из папок,
        //а нам необходимо получить соседнюю запись на том же уровне вложенности, что и текущая запись.
        //Поэтому воспользуемся проекцией, которая предоставляет необходимы функционал.
        //Для плоского списка мо_moveItemsInnerжно получить следующий(предыдущий) элемент просто по индексу в рекордсете.
        if (this._parentProperty) {
            const display = TreeItemsUtil.getDefaultDisplayTree(this._items, {
                keyProperty: this._keyProperty,
                parentProperty: this._parentProperty,
                nodeProperty: this._nodeProperty
            }, {});
            if (this._root) {
                display.setRoot(this._root)
            }
            const collectionItem = display.getItemBySourceItem(this.getModel(item));
            let siblingItem;
            if (position === MOVE_POSITION.before) {
                siblingItem = display.getPrevious(collectionItem);
            } else {
                siblingItem = display.getNext(collectionItem);
            }
            return siblingItem ? siblingItem.getContents() : null;
        }
        return super.getSiblingItem(item, position);
    }

    /**
     * Перемещает элементы в ресурсе
     * @param items
     * @param targetId
     * @param position
     * @private
     */
    protected _moveInSource(items: Model[], targetId: TKeySelection, position: MOVE_POSITION): Promise<DataSet|void> {
        const idArray = items.map((item) => this.getId(item));

        //If reverse sorting is set, then when we call the move on the source, we invert the position.
        if (position !== MOVE_POSITION.on && this._sortingOrder !== DEFAULT_SORTING_ORDER) {
            position = position === MOVE_POSITION.after ? MOVE_POSITION.before : MOVE_POSITION.after;
        }
        return this._source.move(idArray, targetId, {
            position,
            parentProperty: this._parentProperty
        });
    }

    private _getItemsBySelection(items: TMoveItems): Promise<TMoveItems> {
            let resultSelection;
            // Support moving with mass selection.
            // Full transition to selection will be made by:
            // https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
            (items as TSelectionRecord).recursive = false;

        if (items instanceof Array) {
            resultSelection = Promise.resolve(items);
        } else {
            // TODO Это похоже, только для дерева
            const filter = this._prepareFilter(this._filter, items);
            resultSelection = getItemsBySelection(items, this._source, this._items, filter);
        }

        return resultSelection;
    }

    private _moveInItems(items: Model[], targetId: TKeySelection, position: MOVE_POSITION): void {
        if (position === MOVE_POSITION.on) {
            this._hierarchyMove(items, targetId);
        } else {
            this._reorderMove(items, targetId, position);
        }
    }

    private _reorderMove(items: Model[], targetId: TKeySelection, position: MOVE_POSITION): void {
        let movedIndex;
        let movedItem;
        const targetItem = this.getModel(targetId);
        let targetIndex = this._items.getIndex(targetItem);

        items.forEach((item: Model) => {
            movedItem = this.getModel(item);
            if (movedItem) {
                if (position === MOVE_POSITION.before) {
                    targetIndex = this._items.getIndex(targetItem);
                }

                movedIndex = this._items.getIndex(movedItem);
                if (movedIndex === -1) {
                    this._items.add(movedItem);
                    movedIndex = this._items.getCount() - 1;
                }

                // TODO Это похоже, только для дерева
                if (this._parentProperty && targetItem.get(this._parentProperty) !== movedItem.get(this._parentProperty)) {
                    //if the movement was in order and hierarchy at the same time, then you need to update parentProperty
                    movedItem.set(this._parentProperty, targetItem.get(this._parentProperty));
                }

                if (position === MOVE_POSITION.after && targetIndex < movedIndex) {
                    targetIndex = (targetIndex + 1) < this._items.getCount() ? targetIndex + 1 : this._items.getCount();
                } else if (position === MOVE_POSITION.before && targetIndex > movedIndex) {
                    targetIndex = targetIndex !== 0 ? targetIndex - 1 : 0;
                }
                this._items.move(movedIndex, targetIndex);
            }
        });
    }

    // TODO Это похоже, только для дерева
    private _hierarchyMove(items: Model[], targetId: TKeySelection) {
        items.forEach((item) => {
            item = this.getModel(item);
            if (item) {
                item.set(this._parentProperty, targetId);
            }
        });
    }

    /**
     * TODO Это похоже, только для дерева
     * Проверяет, является ли элемент перемещаемым?
     * Для дерева проверяет содержится ли элемент в RecordSet
     * @param item
     * @param target
     * @param position
     * @private
     */
    private _checkItem(item, target: Model, position) {
        let key;
        let parentsMap;
        const movedItem = this.getModel(item);

        //Check for a item to be moved because it may not be in the current RecordSet
        if (this._parentProperty && movedItem) {
            if (target && position === MOVE_POSITION.on && target.get(this._nodeProperty) === null) {
                return false;
            }
            parentsMap = this._getParentsMap(target);
            key = '' + movedItem.get(this._keyProperty);
            if (parentsMap.indexOf(key) !== -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * TODO Это похоже, только для дерева
     * Получает ключи родителей по _parentProperty и из getMetaData
     * @param item
     */
    private _getParentsMap(item: Model): TKeysSelection {
        let id: TKeySelection;
        const result: TKeysSelection = [];
        const path = this._items.getMetaData().path;

        while (item) {
            id = '' + this.getId(item);
            if (result.indexOf(id) === -1) {
                result.push(id);
            } else {
                break;
            }
            id = item.get(this._parentProperty);
            item = this.getModel(id);
        }
        if (path) {
            path.forEach((elem) => {
                id = this.getId(elem);
                if (result.indexOf(id) === -1) {
                    result.push('' + id);
                }
            });
        }
        return result;
    }

    // TODO Это похоже, только для дерева
    private _prepareFilter(filter, selection): object {
        const searchParam = this._searchParam;
        const root = this._root;
        let resultFilter = filter;

        if (searchParam && !selection.selected.includes(root)) {
            resultFilter = {...filter};
            delete resultFilter[searchParam];
        }

        return resultFilter;
    }
}
