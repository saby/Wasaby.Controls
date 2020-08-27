import {Model} from 'Types/entity';
import {DataSet} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {ISelectionObject, TKeySelection, TKeysSelection} from 'Controls/interface';
import {Dialog} from 'Controls/popup';

import {
    IMoveStrategy,
    MOVE_POSITION,
    TMoveItem,
    TMoveItems
} from './interface/IMoveStrategy';

import {MoveItemsStrategy} from './strategy/MoveItemsStrategy';
import {MoveObjectStrategy} from './strategy/MoveObjectStrategy';
import {ItemsValidator} from './ItemsValidator';
import {IMoveDialogOptions} from './interface/IMoveDialogOptions';
import {IControllerOptions} from './interface/IControllerOptions';
import {IStrategyOptions, TSource} from './interface/IStrategyOptions';



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
 * Controller to move the list items in recordSet and dataSource.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FOperationsPanel%2FDemo">Demo examples</a>.
 * @class Controls/_mover/Controller
 * @control
 * @public
 * @author Аверкиев П.А
 */
export class Controller {

    private _strategy: IMoveStrategy<TMoveItems>;

    protected _dialogOptions: IMoveDialogOptions;

    private _strategyOptions: IStrategyOptions;

    private _items: RecordSet;

    private _source: TSource;

    private _keyProperty: string;

    constructor(options: IControllerOptions) {
        this.update(options);
    }

    update(options: IControllerOptions) {
        this._dialogOptions = options.dialog;
        this._items = options.items;
        this._keyProperty = options.keyProperty;
        this._source = options.source;
        this._strategyOptions = {
            items: options.items,
            keyProperty: options.keyProperty,
            sortingOrder: options.sortingOrder,
            source: options.source,
            filter: options.filter,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            root: options.root,
            searchParam: options.searchParam
        }
        if (this._strategy) {
            this._strategy.update(options);
        }
    }

    /**
     * Позволяет переместить запись относительно указанного элемента
     * @param items
     * @param target
     * @param position
     * @param moveType
     */
    moveItems(items: TMoveItems, target: Model|TKeySelection, position: MOVE_POSITION, moveType?: string): Promise<DataSet|void> {
        if (target === undefined) {
            return Promise.resolve();
        }
        return this._getStrategy(items).moveItems(items, target, position, moveType);
    }

    /**
     * Перемещает запись вверх
     * @param item
     */
    moveItemUp(item: TMoveItem): Promise<DataSet|void> {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.before);
    }

    /**
     * Перемещает запись вниз
     * @param item
     */
    moveItemDown(item: TMoveItem): Promise<DataSet|void> {
        return this._moveItemToSiblingPosition(item, MOVE_POSITION.after);
    }

    /**
     * Перемещает запись при помощи окна Mover
     * @param items
     */
    moveItemsWithDialog(items: TMoveItems): Promise<string> {
        if (this._dialogOptions.template) {
            if (ItemsValidator.validate(items)) {
                return this._getStrategy(items).getItems(items).then((selectedItems) => (
                    this._openMoveDialog(selectedItems)
                ));
            }
        } else {
            Logger.warn('Mover: Can\'t call moveItemsWithDialog! moveDialogTemplate option, is undefined', this);
        }
        return Promise.resolve(undefined);
    }

    /**
     * Получает промис с выделенными записями
     * Метод необходим для совместимости с HOC
     * @param items
     * @param target
     * @param position
     */
    getItems(items: TMoveItems, target: Model|TKeySelection, position: MOVE_POSITION): Promise<TMoveItems> {
        return this._getStrategy(items).getItems(items, target, position);
    }

    /**
     * Получает ключи выделенных записей
     * Метод необходим для совместимости с HOC
     * @param items
     */
    getSelectedKeys(items: TMoveItems): TKeysSelection {
        return this._getStrategy(items).getSelectedKeys(items);
    }

    /**
     * Получает элемент к которому мы перемещаем текущий элемент
     * Метод сделан публичным для совместимости с HOC
     * @param item текущий элемент
     * @param position позиция (направление перемещения)
     * @private
     */
    getSiblingItem(item: TMoveItem, position: MOVE_POSITION): Model {
        return this._getStrategy([item]).getSiblingItem(item, position);
    }

    /**
     * Открывает диалог перемещения
     * @param items
     * @private
     */
    private _openMoveDialog(items: TMoveItems): Promise<string> {
        const templateOptions = {
            movedItems: this._getStrategy(items).getSelectedKeys(items),
            source: this._source,
            keyProperty: this._keyProperty,
            ...this._dialogOptions.templateOptions
        };

        if (!this._dialogOptions.onResultHandler) {
            this._dialogOptions.onResultHandler = this._moveDialogOnResultHandler.bind(this);
        }

        return Dialog.openPopup({
            opener: this._dialogOptions.opener,
            templateOptions,
            closeOnOutsideClick: true,
            template: this._dialogOptions.template,
            eventHandlers: {
                onResult: (target: Model) => (
                    this._dialogOptions.onResultHandler(items, target)
                )
            }
        });
    }

    /**
     * Стандартный обработчик перемещения при помощи диалога
     * @param items
     * @param target
     * @private
     */
    private _moveDialogOnResultHandler(items: TMoveItems, target: Model): Promise<DataSet|void> {
        return this.moveItems(items, target.getKey(), MOVE_POSITION.on);
    }

    /**
     * Перемещает запись к ближайшей позиции
     * @param item
     * @param position
     * @private
     */
    private _moveItemToSiblingPosition (item: TMoveItem, position: MOVE_POSITION): Promise<DataSet|void> {
        const target = this.getSiblingItem(item, position);
        return target ? this.moveItems([item], target, position) : Promise.resolve();
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
