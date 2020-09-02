import {Model, Record} from 'Types/entity';
import {SbisService, Memory, BindingMixin, DataSet, IData} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {ISelectionObject, TKeySelection} from 'Controls/interface';
import {Confirmation, Dialog} from 'Controls/popup';
import * as rk from 'i18n!*';

import {IMoveDialogOptions} from '../interface/IMoveDialogOptions';
import {IMoveControllerOptions} from '../interface/IMoveControllerOptions';
import * as TreeItemsUtil from "../resources/utils/TreeItemsUtil";
import {IHashMap} from 'Types/declarations';

/**
 * @typedef {String} TMovePosition
 * @description
 * Позиция для перемещения записи
 */
export enum TMovePosition {
    on = 'on',
    before = 'before',
    after = 'after'
}

/**
 * Контроллер для перемещения элементов списка в recordSet и dataSource.
 *
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FtreeGrid%2FMover%2FBase%2FIndex">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/actions/mover/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less">переменные тем оформления</a>
 *
 * @class Controls/_mover/MoveController
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
export class MoveController {

    protected _dialogOptions: IMoveDialogOptions;

    // пока контроллер не умеет работать с source для перемещения записей относиетльно друг друга
    private _items: RecordSet;

    // Ресурс, в котором производится смена мест
    private _source: SbisService|Memory;

    // Имя свойства, хранящего ключ записи
    private _keyProperty: string;

    // Имя свойства, хранящего ключ родителя в дереве
    protected _parentProperty: string;

    // Имя свойства, хранящего флаг узла в дереве
    protected _nodeProperty: string;

    // Корень дерева для создания display при поиске ближайших записей
    protected _root: string;

    constructor(options: IMoveControllerOptions) {
        this.update(options);
    }

    /**
     * Обновляет параметры контроллера
     * @function Controls/_list/Controllers/MoveController#moveItems
     * @param {Controls/_list/interface/IMoveControllerOptions} options
     */
    update(options: IMoveControllerOptions): void {
        this._dialogOptions = options.dialog;
        this._items = options.items;
        this._keyProperty = options.keyProperty;
        this._source = options.source;
        this._items = options.items;
        this._nodeProperty = options.nodeProperty;
        this._parentProperty = options.parentProperty;
        this._root = options.root;
    }

    /**
     * Перемещает переданные элементы относительно указанного целевого элемента.
     * @function Controls/_list/Controllers/MoveController#moveItems
     * @param {Controls/_list/interface/ISelection} selection Элементы для перемещения.
     * @param {Types/declarations:IHashMap} дополнительный фильтр для перемещения в SbisService.
     * @param {Controls/interface:TKeySelection} targetItemKey ID целевого элемента перемещения.
     * @param {Controls/_list/interface/ISelection/TMovePosition.typedef} position Положение перемещения.
     * @param {String} moveType
     * @returns {Promise} Отложенный результат перемещения.
     * @remark
     * В зависимости от аргумента 'position' элементы могут быть перемещены до, после или на указанный целевой элемент.
     * @see moveItemUp
     * @see moveItemDown
     */

    /*
     * Moves the transferred items relative to the specified target item.
     * @function Controls/_list/Controllers/MoveController#moveItems
     * @param {Controls/_list/interface/ISelection} selection to be moved.
     * @param {Types/declarations:IHashMap} дополнительный фильтр для перемещения в SbisService.
     * @param {Controls/interface:TKeySelection} targetItemKey Target item id to move.
     * @param {Controls/_list/interface/ISelection/TMovePosition.typedef} position Position to move.
     * @returns {Core/Deferred} Deferred with the result of the move.
     * @remark
     * Depending on the 'position' argument, elements can be moved before, after or on the specified target item.
     * @see moveItemUp
     * @see moveItemDown
     */
    moveItems(selection: ISelectionObject, filter: IHashMap<any>, targetItemKey: TKeySelection, position: TMovePosition): Promise<DataSet|void> {
        return this._moveInSource(selection, filter, targetItemKey, position);
    }

    /**
     * Перемещает один элемент вверх.
     * @function Controls/_list/Controllers/MoveController#moveItemUp
     * @param {Controls/interface:TKeySelection} selectedItemKey Элемент перемещения.
     * @returns {Promise} Отложенный результат перемещения.
     * @see moveItemDown
     * @see moveItems
     */

    /*
     * Move one item up.
     * @function Controls/_list/Controllers/MoveController#moveItemUp
     * @param {Controls/interface:TKeySelection} selectedItemKey The item to be moved.
     * @returns {Promise} Deferred with the result of the move.
     * @see moveItemDown
     * @see moveItems
     */
    moveItemUp(selectedItemKey: TKeySelection): Promise<DataSet|void> {
        return this._moveItemToSiblingPosition(selectedItemKey, TMovePosition.before);
    }

    /**
     * Перемещает один элемент вниз.
     * @function Controls/_list/Controllers/MoveController#moveItemDown
     * @param {Controls/interface:TKeySelection} selectedItemKey Элемент перемещения.
     * @returns {Promise} Отложенный результат перемещения.
     * @see moveItemUp
     * @see moveItems
     */

    /*
     * Move one item down.
     * @function Controls/_list/Controllers/MoveController#moveItemDown
     * @param {Controls/interface:TKeySelection} selectedItemKey The item to be moved.
     * @returns {Promise} Deferred with the result of the move.
     * @see moveItemUp
     * @see moveItems
     */
    moveItemDown(selectedItemKey: TKeySelection): Promise<DataSet|void> {
        return this._moveItemToSiblingPosition(selectedItemKey, TMovePosition.after);
    }

    /**
     * Перемещение переданных элементов с предварительным выбором родительского узла с помощью диалогового окна.
     * @function Controls/_list/Controllers/MoveController#moveItemsWithDialog
     * @param {Controls/_list/interface/ISelection} selection Элементы для перемещения.
     * @param {Types/declarations:IHashMap} filter Элементы для перемещения.
     * @remark
     * Компонент, указанный в опции {Controls/_list/interface/IMoveDialogOptions#template dialog.template}, будет использоваться в качестве шаблона для диалога перемещения.
     * Для того, чтобы получить управление над результатом перемещения, необходимо использовать опцию
     * @see moveItemUp
     * @see moveItemDown
     * @see moveItems
     */

    /*
     * Move the transferred items with the pre-selection of the parent node using the dialog.
     * @function Controls/_list/Controllers/MoveController#moveItemsWithDialog
     * @param {Controls/_list/interface/ISelection} selection Items to be moved.
     * @param {Types/declarations:IHashMap} filter Элементы для перемещения.
     * @remark
     * The component specified in the {Controls/_list/interface/IMoveDialogOptions#template dialog.template} option will be used as a template for the move dialog.
     * @see moveItemUp
     * @see moveItemDown
     * @see moveItems
     */
    moveItemsWithDialog(selection: ISelectionObject, filter: IHashMap<any>): Promise<void|DataSet> {
        if (!this._dialogOptions.template) {
            Logger.error('MoveController: MoveDialogTemplate option is undefined', this);
            return Promise.reject();
        }
        if (!MoveController._validate(selection)) {
            Logger.error('MoveController: Selection is not correct to be moved', this);
            return Promise.reject();
        }
        return this._openMoveDialog(selection, filter)
    }

    /**
     * Получает элемент к которому мы перемещаем текущий элемент
     * @param selectedItemKey текущий элемент
     * @param position позиция (направление перемещения)
     * @private
     */
    private _getTargetItemKey(selectedItemKey: TKeySelection, position: TMovePosition): TKeySelection {
        //В древовидной структуре, нужно получить следующий(предыдущий) с учетом иерархии.
        //В рекордсете между двумя соседними папками, могут лежат дочерние записи одной из папок,
        //а нам необходимо получить соседнюю запись на том же уровне вложенности, что и текущая запись.
        //Поэтому воспользуемся проекцией, которая предоставляет необходимы функционал.
        //Для плоского списка можно получить следующий(предыдущий) элемент просто по индексу в рекордсете.
        const selectionModel = this._items.getRecordById(selectedItemKey);
        let siblingItem: Model;
        if (this._parentProperty) {
            const display = TreeItemsUtil.getDefaultDisplayTree(this._items, {
                keyProperty: this._keyProperty,
                parentProperty: this._parentProperty,
                nodeProperty: this._nodeProperty
            }, {});
            if (this._root) {
                display.setRoot(this._root)
            }
            const collectionItem = display.getItemBySourceItem(selectionModel);
            let siblingCollectionItem;
            if (position === TMovePosition.before) {
                siblingCollectionItem = display.getPrevious(collectionItem);
            } else {
                siblingCollectionItem = display.getNext(collectionItem);
            }
            siblingItem = siblingCollectionItem ? siblingCollectionItem.getContents() : null;
        } else {
            let itemIndex = this._items.getIndex(selectionModel);
            siblingItem = this._items.at(position === TMovePosition.before ? --itemIndex : ++itemIndex)
        }
        return siblingItem?.getKey();
    }

    /**
     * Открывает диалог перемещения
     * @param {Controls/_list/interface/ISelection} selection
     * @param {Types/collection:IHashMap} filter
     * @private
     */
    private _openMoveDialog(selection: ISelectionObject, filter: IHashMap<any>): Promise<void|DataSet> {
        const templateOptions = {
            movedItems: selection.selected,
            source: this._source,
            keyProperty: this._keyProperty,
            ...this._dialogOptions.templateOptions
        };

        return new Promise((resolve) => {
            Dialog.openPopup({
                opener: this._dialogOptions.opener,
                templateOptions,
                closeOnOutsideClick: true,
                template: this._dialogOptions.template,
                eventHandlers: {
                    onResult: (target: Model) => {
                        resolve(this.moveItems(selection, filter, target.getKey(), TMovePosition.on))
                    }
                }
            });
        });
    }

    /**
     * Перемещает запись к ближайшей позиции
     * @param selectedItemKey
     * @param position
     * @private
     */
    private _moveItemToSiblingPosition(selectedItemKey: TKeySelection, position: TMovePosition): Promise<DataSet|void> {
        const targetItemId = this._getTargetItemKey(selectedItemKey, position);
        if (!targetItemId) {
            return Promise.reject();
        }
        const selection: ISelectionObject = {
            selected: [selectedItemKey],
            excluded: []
        }
        return this._moveInSource(selection, {}, targetItemId, position);
    }

    /**
     * Перемещает элементы в SbisService
     * @param selection
     * @param filter
     * @param targetItemKey
     * @param position
     * @private
     */
    private _moveInSource(selection: ISelectionObject, filter: IHashMap<any>, targetItemKey: TKeySelection, position: TMovePosition): Promise<DataSet|void>  {
        if ((this._source as SbisService).call) {
            return import('Controls/operations').then((operations) => {

                const sourceAdapter = (this._source as SbisService).getAdapter();
                const callFilter = {
                    selection: operations.selectionToRecord(selection, sourceAdapter), ...filter
                };
                return (this._source as SbisService).call((this._source as SbisService).getBinding().move, {
                    method: (this._source as SbisService).getBinding().list,
                    filter: Record.fromObject(callFilter, sourceAdapter),
                    folder_id: targetItemKey
                });
            });
        }
        // Добавлено по https://online.sbis.ru/opendoc.html?guid=f0471d87-a7eb-455b-9e02-645c69abcec6
        return this._source.move(selection.selected, targetItemKey, {
            position,
            parentProperty: this._parentProperty
        });
    }

    /**
     * Производит проверку переданных параметров. Если массив значений пуст,
     * возвращает false и выводит окно с текстом, иначе возвращает true.
     * @function
     * @name Controls/_list/Controllers/MoveController#_validate
     * @private
     */
    private static _validate(selection: ISelectionObject): boolean {
        let resultValidate: boolean = true;

        if (selection.selected && !selection.selected.length) {
            resultValidate = false;
            Confirmation.openPopup({
                type: 'ok',
                message: rk('Нет записей для обработки команды')
            });
        }

        return resultValidate;
    }
}
