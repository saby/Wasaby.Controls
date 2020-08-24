import {Model} from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {IMovableItem} from './interface/IMovableItem';
import {IMovableItemsCollection} from './interface/IMovableItemsCollection';
import {IMoveStrategy} from './interface/IMoveStrategy';

import {RecordSetStrategy} from './strategy/RecordSetStrategy';
import {MoveObjectStrategy, IMoveItemsParams} from './strategy/MoveObjectStrategy';

enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
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

    _strategy: IMoveStrategy<Model[]|IMoveItemsParams>;

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

    private _moveItems(items: RecordSet|IMoveItemsParams, target, position): Promise<any> {
        const self = this;
        if (target === undefined) {
            return Promise.resolve();
        }
        return this.getStrategy().moveItems(items, target, position);
    }

    private getStrategy(items: RecordSet|IMoveItemsParams): IMover {
        if (!this._strategy) {
            this._strategy = !(items as RecordSet).forEach && !(items as RecordSet).selected ? new MoveObjectStrategy() : new RecordSetStrategy();
        }
        return this._strategy;
    }
}
