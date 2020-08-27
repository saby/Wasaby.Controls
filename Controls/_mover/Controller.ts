import {Model} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import * as InstanceChecker from 'Core/core-instance';
import {ISelectionObject, TKeySelection} from 'Controls/interface';
import {Dialog} from 'Controls/popup';
import {Control, IControlOptions} from 'UI/Base';

import {
    IMoveStrategy,
    ISource,
    IStrategyOptions,
    MOVE_POSITION,
    TMoveItem,
    TMoveItems
} from './interface/IMoveStrategy';

import {MoveItemsStrategy} from './strategy/MoveItemsStrategy';
import {MoveObjectStrategy} from './strategy/MoveObjectStrategy';
import {ItemsValidator} from './ItemsValidator';

interface IMoveDialogOptions {
    /**
     * Необходим для moverDialog
     */
    opener: Control<IControlOptions, unknown> | null;
    /**
     * Опции для шаблона диалога
     */
    templateOptions?: object;
    /**
     * Название шаблона диалога
     */
    template?: string;
    /**
     * Обработчики событий диалога
     */
    eventHandlers?: {
        onResult?: (target) => void;
    }
}

/**
 * Интерфейс контроллера
 */
export interface IControllerOptions extends IStrategyOptions {
    dialog?: IMoveDialogOptions
}

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

    private _source: ISource;

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
    }

    /**
     * Позволяет переместить запись относительно указанного элемента
     * @param items
     * @param target
     * @param position
     * @param moveType
     */
    moveItems(items: TMoveItems, target: Model, position: MOVE_POSITION, moveType?: string): Promise<any> {
        if (target === undefined) {
            return Promise.resolve();
        }
        return this._getStrategy(items).moveItems(items, target.getKey(), position, moveType);
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
        if (this._dialogOptions.template) {
            if (ItemsValidator.validate(items)) {
                this._getStrategy(items).getSelectedItems(items).then((selectedItems) => (
                    this._openMoveDialog(this._prepareMovedItems(selectedItems))
                ));
            }
        } else {
            Logger.warn('Mover: Can\'t call moveItemsWithDialog! moveDialogTemplate option, is undefined', this);
        }
    }

    /**
     * Получает промис с выделенными записями
     * Метод необходим для совместимости с HOC
     * @param items
     * @param target
     * @param position
     */
    getSelectedItems(items: TMoveItems, target: Model, position: MOVE_POSITION): Promise<TMoveItems> {
        return this._getStrategy(items).getSelectedItems(items, target.getKey(), position);
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
    private _openMoveDialog(items: TMoveItems): void {
        const templateOptions = {
            movedItems: items,
            source: this._source,
            keyProperty: this._keyProperty,
            ...this._dialogOptions.templateOptions
        };

        if (!this._dialogOptions.eventHandlers) {
            this._dialogOptions.eventHandlers = {};
        }
        if (!this._dialogOptions.eventHandlers.onResult) {
            this._dialogOptions.eventHandlers.onResult = this._moveDialogOnResultHandler.bind(this);
        }

        Dialog.openPopup({
            opener: this._dialogOptions.opener,
            templateOptions,
            closeOnOutsideClick: true,
            template: this._dialogOptions.template,
            eventHandlers: this._dialogOptions.eventHandlers
        });
    }

    /**
     * Возвращает список Id если был передан список Model
     * @param items
     * @private
     */
    private _prepareMovedItems(items: TMoveItems): TMoveItems {
        let result = [];
        items.forEach((item) => result.push(this._getId(item)));
        return result;
    }

    /**
     * Стандартный обработчик перемещения при помощи диалога
     * @param items
     * @param target
     * @private
     */
    private _moveDialogOnResultHandler(items: TMoveItems, target: Model) {
        this.moveItems(items, target.getKey(), MOVE_POSITION.on);
    }

    /**
     * Перемещает запись к ближайшей позиции
     * @param item
     * @param position
     * @private
     */
    private _moveItemToSiblingPosition (item: TMoveItem, position: MOVE_POSITION): Promise<void> {
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

    /**
     * Получает ключ по item
     * Item может быть или Model или ключом
     * Еслит Model, то идёт попытка получить ключ по _keyProperty
     * @param item
     */
    private _getId(item: Model|TKeySelection): TKeySelection {
        return InstanceChecker.instanceOfModule(item, 'Types/entity:Model') ? (item as Model).get(this._keyProperty) : item as TKeySelection;
    }
}
