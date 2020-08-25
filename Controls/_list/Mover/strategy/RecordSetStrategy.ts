import { RecordSet } from 'Types/collection';
import {Model} from 'Types/entity';
import * as getItemsBySelection from 'Controls/Utils/getItemsBySelection';

import { IMoveStrategy, BEFORE_ITEMS_MOVE_RESULT } from '../interface/IMoveStrategy';
import {BaseStrategy, MOVE_POSITION} from './BaseStrategy';


const DEFAULT_SORTING_ORDER = 'asc';

export class RecordSetStrategy extends BaseStrategy implements IMoveStrategy<Model[]> {
    private _items: RecordSet;

    moveItems(items: Model[], target, position): Promise<any> {
        return this._getItemsBySelection(items).then(function (items) {
            items = items.filter((item) => {
                return this.checkItem(self, item, target, position);
            });
            if (items.length) {
                return this.moveItemsInner(items, target, position);
            }
            return Promise.resolve();
        });
    }

    protected _beforeItemsMoveResultHandler(items, target, position, result): Promise<any> {
        if (result === BEFORE_ITEMS_MOVE_RESULT.MOVE_IN_ITEMS) {
            this._moveInItems(items, target, position);
        } else if (result !== BEFORE_ITEMS_MOVE_RESULT.CUSTOM) {
            return this._moveInSource(items, target, position).then((moveResult) => {
                this._moveInItems(items, target, position);
                return moveResult;
            });
        }
        return Promise.resolve();
    }

    protected _moveInSource(items: Model[], target, position: MOVE_POSITION) {
        const targetId = this._getIdByItem(target);
        const idArray = items.map(function (item) {
                return _private.getIdByItem(self, item);
            });

        //If reverse sorting is set, then when we call the move on the source, we invert the position.
        if (position !== MOVE_POSITION.on && this._sortingOrder !== DEFAULT_SORTING_ORDER) {
            position = position === MOVE_POSITION.after ? MOVE_POSITION.before : MOVE_POSITION.after;
        }
        return self._source.move(idArray, targetId, {
            position,
            parentProperty: self._options.parentProperty
        });
    }

    private _moveInItems(items: Model[], target, position: MOVE_POSITION) {
        if (position === MOVE_POSITION.on) {
            this._hierarchyMove(items, target);
        } else {
            this._reorderMove(items, target, position);
        }
    }

    private _reorderMove(items: Model[], target, position: MOVE_POSITION) {
        let movedIndex;
        let movedItem;
        const parentProperty = this._parentProperty;
        const targetId = this._getIdByItem(target);
        const targetItem = this._getModelByItem(targetId);
        let targetIndex = this._items.getIndex(targetItem);

        items.forEach((item: Model) => {
            movedItem = this._getModelByItem(item);
            if (movedItem) {
                if (position === MOVE_POSITION.before) {
                    targetIndex = this._items.getIndex(targetItem);
                }

                movedIndex = this._items.getIndex(movedItem);
                if (movedIndex === -1) {
                    this._items.add(movedItem);
                    movedIndex = this._items.getCount() - 1;
                }

                if (parentProperty && targetItem.get(parentProperty) !== movedItem.get(parentProperty)) {
                    //if the movement was in order and hierarchy at the same time, then you need to update parentProperty
                    movedItem.set(parentProperty, targetItem.get(parentProperty));
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

    private _hierarchyMove(items: Model[], target) {
        const targetId = this._getIdByItem(target);
        items.forEach((item) => {
            item = this._getModelByItem(item);
            if (item) {
                item.set(this._parentProperty, targetId);
            }
        });
    }

    private _getItemsBySelection(selection): Promise<Record<string, unknown>> {
        let resultSelection;
        // Support moving with mass selection.
        // Full transition to selection will be made by:
        // https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
        selection.recursive = false;

        if (selection instanceof Array) {
            resultSelection = Promise.resolve(selection);
        } else {
            const filter = this._prepareFilter(this, this._filter, selection);
            resultSelection = getItemsBySelection(selection, this._source, this._items, filter);
        }

        return resultSelection;
    }
}
