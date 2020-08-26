import {Model} from 'Types/entity';
import {Logger} from 'UI/Utils';
import {TemplateFunction} from 'UI/Base';
import {ISelectionObject} from 'Controls/interface';

import {IMovableItem} from './interface/IMovableItem';
import {IMoveStrategy, IStrategyOptions, TMoveItem, TMoveItems} from './interface/IMoveStrategy';

import {MoveItemsStrategy} from './strategy/MoveItemsStrategy';
import {MoveObjectStrategy} from './strategy/MoveObjectStrategy';
import {ItemsValidator} from './ItemsValidator';

enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
}

// todo раздели интерфейсы
export interface IControllerOptions extends IStrategyOptions {}

/**
 * Контроллер для перемещения элементов списка в recordSet и dataSource.
 *
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FtreeGrid%2FMover%2FBase%2FIndex">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/actions/mover/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less">переменные тем оформления</a>
 *
 * @class Controls/_mover/Controller
 * @control
 * @public
 * @author Аверкиев П.А
 */

/*
 * Сontroller to move the list items in recordSet and dataSource.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FOperationsPanel%2FDemo">Demo examples</a>.
 * @class Controls/_mover/Controller
 * @control
 * @public
 * @author Аверкиев П.А
 */
export class Controller {

    _strategy: IMoveStrategy<TMoveItems>;

    _moveDialogTemplate: TemplateFunction;

    _strategyOptions: IStrategyOptions;

    constructor(options: IControllerOptions) {
        this.update(options);
    }

    update(options: IControllerOptions) {
        this._moveDialogTemplate = options.moveDialogTemplate
        this._strategyOptions = {
            items: options.items, // Возможно, поменяется на collection
            keyProperty: options.keyProperty,
            moveDialogOptions: options.moveDialogOptions,
            sortingOrder: options.sortingOrder,
            source: options.source,
            filter: options.filter,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            root: options.root,
            searchParam: options.searchParam,
            beforeItemsMove: options.beforeItemsMove,
            afterItemsMove: options.afterItemsMove
        }
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
     * Перемещает запись при помощи окна Mover
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

    /**
     * Перемещает запись к ближайшей позиции
     * @param item
     * @param position
     * @private
     */
    private _moveItemToSiblingPosition (item: TMoveItem, position: MOVE_POSITION): Promise<void> {
        const target = this._getSiblingItem(item, position);
        return target ? this.moveItems([item], target, position) : Promise.resolve();
    }

    /**
     * Получает элемент к которому мы перемещаем текущий элемент
     * @param item текущий элемент
     * @param position позиция (направление перемещения)
     * @private
     */
    private _getSiblingItem(item: TMoveItem, position: MOVE_POSITION): IMovableItem {
        return this._getStrategy([item]).getSiblingItem(item, position);
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
