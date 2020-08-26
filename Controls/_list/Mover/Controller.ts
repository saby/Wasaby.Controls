import {Model} from 'Types/entity';
import {Logger} from 'UI/Utils';
import {TemplateFunction} from 'UI/Base';
import {ISelectionObject} from 'Controls/interface';

import {IMovableItem} from './interface/IMovableItem';
import {IMovableItemsCollection} from './interface/IMovableItemsCollection';
import {IMoveStrategy, IStrategyOptions, TMoveItem, TMoveItems} from './interface/IMoveStrategy';

import {MoveItemsStrategy} from './strategy/MoveItemsStrategy';
import {MoveObjectStrategy} from './strategy/MoveObjectStrategy';
import {ItemsValidator} from './ItemsValidator';

enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
}

export interface IControllerOptions extends IStrategyOptions {
    moveDialogTemplate: TemplateFunction;
}

// Что делает контроллер
// Меняет местами запись в плоской модели
// Меняет местами запись в деревянной модели
// Позволяет переместить запись при помощи окна Mover
// Позволяет мереместиь запись относительно указанного элемента
export class Controller {
    // @todo пока работать не будет. надо обсудить
    _collection: IMovableItemsCollection;

    _strategy: IMoveStrategy<TMoveItems>;

    _moveDialogTemplate: TemplateFunction;

    _strategyOptions: IStrategyOptions;

    constructor(options: IControllerOptions) {
        this._moveDialogTemplate = options.moveDialogTemplate
        this._strategyOptions.items = options.items; // Возможно, поменяется на collection
        this._strategyOptions.keyProperty = options.keyProperty;
        this._strategyOptions.moveDialogOptions = options.moveDialogOptions;
        this._strategyOptions.sortingOrder = options.sortingOrder;
        this._strategyOptions.source = options.source;
        this._strategyOptions.filter = options.filter;
        this._strategyOptions.nodeProperty = options.nodeProperty;
        this._strategyOptions.parentProperty = options.parentProperty;
        this._strategyOptions.root = options.root;
        this._strategyOptions.searchParam = options.searchParam;
    }

    /**
     * Позволяет мереместиь запись относительно указанного элемента
     * @param items
     * @param target
     * @param position
     */
    moveItems(items: TMoveItems, target: IMovableItem, position): Promise<any> {
        if (target === undefined) {
            return Promise.resolve();
        }
        return this._getStrategy(items).moveItems(items, target, position);
    }

    /**
     * Перемещает запись вверх
     * @param item
     */
    moveItemUp(item: TMoveItem) {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.before);
    }

    /**
     * Перемещает запись вниз
     * @param item
     */
    moveItemDown(item: TMoveItem) {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.after);
    }

    /**
     * Позволяет переместить запись при помощи окна Mover
     * @param items
     */
    moveItemsWithDialog(items: TMoveItems): void {
        if (this._moveDialogTemplate) {
            if (ItemsValidator.validate(items)) {
                this._getStrategy(items).moveItemsWithDialog(items, this._moveDialogTemplate);
            }
        } else {
            Logger.warn('Mover: Can\'t call moveItemsWithDialog! moveDialogTemplate option, is undefined', this);
        }
    }

    private _moveItemToSiblingPosition (item: TMoveItem, position: MOVE_POSITION): Promise<void> {
        const target = this._getSiblingItem(item, position);
        return target ? this.moveItems([item], target, position) : Promise.resolve();
    }

    /**
     * @todo пока работать не будет. надо обсудить, мы работаем с RecordSet или можем работать с Collection
     * Получает элемент к которому мы перемещаем текущий элемент
     * @param item текущий элемент
     * @param position позиция (направление перемещения)
     * @private
     */
    private _getSiblingItem(item: TMoveItem, position: MOVE_POSITION): IMovableItem {
        let siblingItem: IMovableItem;
        const collectionItem = this._collection.getItemBySourceItem(this._getStrategy([item]).getId(item));
        if (position === MOVE_POSITION.before) {
            siblingItem = this._collection.getPrevious(collectionItem);
        } else {
            siblingItem = this._collection.getNext(collectionItem);
        }
        return siblingItem || null;
    }

    /**
     * Возвращает стратегию работы по новой логике или по старой
     * @param items
     * @private
     */
    private _getStrategy(items: TMoveItems): IMoveStrategy<TMoveItems> {
        if (!this._strategy) {
            this._strategy = !(items as Model[]).forEach && !(items as ISelectionObject).selected ?
                new MoveObjectStrategy(this._strategyOptions) :
                new MoveItemsStrategy(this._strategyOptions);
        }
        return this._strategy;
    }
}
