import {Model} from 'Types/entity';
import {IMovableItem} from './interface/IMovableItem';
import {IMovableItemsCollection} from './interface/IMovableItemsCollection';
import {TKeysSelection} from "../../_interface/ISelectionType";

enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
}

interface IMoveItemsParams {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    filter: object;
}

// Что делает контроллер
// Меняет местами запись в плоской модели
// Меняет местами запись в деревянной модели
// Позволяет переместить запись при помощи окна Mover
// Позволяет мереместиь запись относительно указанного элемента
//
// 1. Я полагаю, что он должен, как и все контроллеры работать с IMovableItemsCollection, но в оригинале он работает с
// Items из context.dataOptions
// 2. Ещё не ясный момент - в старом контроле есть newLogic - что это за newLogic и не нужно ли её учитывать?
export class Controller {
    _collection: IMovableItemsCollection;

    moveItemUp(item: IMovableItem) {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.before);
    }

    moveItemDown(item: IMovableItem) {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.after);
    }

    private _moveItemToSiblingPosition (item: IMovableItem, position: MOVE_POSITION): Promise<void> {
        const target = this._getSiblingItem(item, position);
        return target ? this._moveItems([item], target, position) : Promise.resolve();
    }

    private _getSiblingItem(item: IMovableItem, position: MOVE_POSITION): IMovableItem {
        let siblingItem: IMovableItem;
        const itemFromProjection = this._collection.getItemBySourceItem(this._getModelByItem(item));
        if (position === MOVE_POSITION.before) {
            siblingItem = this._collection.getPrevious(itemFromProjection);
        } else {
            siblingItem = this._collection.getNext(itemFromProjection);
        }
        return siblingItem || null;
    }

    private _moveItems(items: IMovableItem[] | IMoveItemsParams, target, position): Promise<any> {
        const self = this;
        const isNewLogic = !items.forEach && !items.selected;
        if (target === undefined) {
            return Promise.resolve();
        }
        return this._getItemsBySelection.call(this, items).addCallback(function (items) {
            items = items.filter((item) => {
                return _private.checkItem(self, item, target, position);
            });
            if (items.length) {
                return _private.moveItems(self, items, target, position);
            } else {
                return Deferred.success();
            }
        });
    }
}
