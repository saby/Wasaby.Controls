import {Model, Record} from 'Types/entity';
import {SbisService, ICrudPlus} from 'Types/source';
import {Logger} from 'UI/Utils';
import {ISelectionObject} from 'Controls/interface';
import {Confirmation, Dialog, IBasePopupOptions} from 'Controls/popup';
import * as rk from 'i18n!*';

import {IHashMap} from 'Types/declarations';
import {IMoverDialogTemplateOptions} from 'Controls/moverDialog';
import {CrudEntityKey} from 'Types/source';

// @todo https://online.sbis.ru/opendoc.html?guid=2f35304f-4a67-45f4-a4f0-0c928890a6fc
type TSource = SbisService|ICrudPlus;
type TFilterObject = IHashMap<any>;

/**
 * Интерфейс опций контроллера
 * @interface Controls/_list/interface/IMoveControllerOptions
 * @public
 * @author Аверкиев П.А.
 */
export interface IMoveControllerOptions {
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#source
     * @cfg {TSource} Ресурс, в котором производится перемещение
     */
    source: TSource;
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#parentProperty
     * @cfg {String} Имя поля, содержащего идентификатор родительского элемента.
     */
    parentProperty: string;
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#popupOptions
     * @cfg {Controls/popup:IBasePopupOptions} опции диалога перемещения
     */
    popupOptions?: IBasePopupOptions
}

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
 * @class Controls/_mover/MoveController
 * @control
 * @public
 * @author Аверкиев П.А
 */
export class MoveController {

    // Опции диалога перемещения записей
    protected _popupOptions: IBasePopupOptions;

    // Ресурс данных, в котором производится смена мест
    private _source: TSource;

    // Имя свойства, хранящего ключ родителя в дереве, необходим для _moveInSource
    protected _parentProperty: string;

    constructor(options: IMoveControllerOptions) {
        this.update(options);
    }

    /**
     * Обновляет параметры контроллера
     * @function Controls/_list/Controllers/MoveController#moveItems
     * @param {Controls/_list/interface/IMoveControllerOptions} options
     */
    update(options: IMoveControllerOptions): void {
        this._popupOptions = options.popupOptions;
        this._source = options.source;
        this._parentProperty = options.parentProperty;
    }

    /**
     * Перемещает переданные элементы относительно указанного целевого элемента или в указанную папку.
     * @function Controls/_list/Controllers/MoveController#move
     * @param {Controls/interface:ISelectionObject} selection Элементы для перемещения.
     * @param {TFilterObject} filter Дополнительный фильтр для перемещения в папку через SbisService.
     * @param {Types/source:CrudEntityKey} targetKey Идентификатор целевой записи, относительно которой позиционируются
     * перемещаемые записи или идентификатор папки, в которую происходит перемещение.
     * @param {TMovePosition} position Положение перемещения.
     * @returns {Promise} Отложенный результат перемещения.
     * @remark
     * В зависимости от аргумента 'position' элементы могут быть перемещены до, после или на указанный целевой элемент.
     * @see moveUp
     * @see moveDown
     */
    move(selection: ISelectionObject, filter: TFilterObject = {}, targetKey: CrudEntityKey, position: TMovePosition): Promise<void> {
        return this._moveInSource(selection, filter, targetKey, position);
    }

    /**
     * Перемещение переданных элементов с предварительным выбором родительского узла с помощью диалогового окна.
     * @function Controls/_list/Controllers/MoveController#moveWithDialog
     * @param {Controls/interface:ISelectionObject} selection Элементы для перемещения.
     * @param {TFilterObject} filter дополнительный фильтр для перемещения в SbisService.
     * @remark
     * Компонент, указанный в опции {Controls/popup/IBasePopupOptions#template popupOptions.template}, будет использоваться в качестве шаблона для диалога перемещения.
     * Для того, чтобы получить управление над результатом перемещения, необходимо использовать опцию
     * @see moveUp
     * @see moveDown
     * @see move
     */
    moveWithDialog(selection: ISelectionObject, filter: TFilterObject = {}): Promise<void> {
        if (!this._popupOptions.template) {
            Logger.error('MoveController: MoveDialogTemplate option is undefined', this);
            return Promise.reject();
        }
        if (!MoveController._validate(selection)) {
            return Promise.reject();
        }
        return this._openMoveDialog(selection, filter)
    }

    /**
     * Открывает диалог перемещения
     * @param {Controls/interface:ISelectionObject} selection Элементы для перемещения.
     * @param {TFilterObject} filter дополнительный фильтр для перемещения в SbisService.
     * @private
     */
    private _openMoveDialog(selection: ISelectionObject, filter?: TFilterObject): Promise<void> {
        const templateOptions: IMoverDialogTemplateOptions = {
            ...(this._popupOptions.templateOptions as IMoverDialogTemplateOptions),
            movedItems: selection.selected,
            source: this._source
        };

        return new Promise((resolve) => {
            Dialog.openPopup({
                opener: this._popupOptions.opener,
                templateOptions,
                closeOnOutsideClick: true,
                template: this._popupOptions.template,
                eventHandlers: {
                    onResult: (target: Model) => {
                        // null при перемещении записей в корень
                        const targetKey = target === null ? target : target.getKey();
                        resolve(this._moveInSource(selection, filter, targetKey, TMovePosition.on))
                    }
                }
            });
        });
    }

    /**
     * Перемещает элементы в ICrudPlus
     * @param {Controls/interface:ISelectionObject} selection Элементы для перемещения.
     * @param {TFilterObject} filter дополнительный фильтр для перемещения в папку в SbisService.
     * @param {Types/source:CrudEntityKey} targetKey Идентификатор целевой записи, относительно которой позиционируются перемещаемые.
     * @param position
     * @private
     */
    private _moveInSource(selection: ISelectionObject, filter: TFilterObject = {}, targetKey: CrudEntityKey, position: TMovePosition): Promise<void>  {
        const source: SbisService = this._source as SbisService;
        /**
         * https://online.sbis.ru/opendoc.html?guid=2f35304f-4a67-45f4-a4f0-0c928890a6fc
         * При использовании ICrudPlus.move() мы не можем передать filter и folder_id, т.к. такой контракт
         * не соответствует стандартному контракту SbisService.move(). Поэтому здесь вызывается call
         */
        if (source.call && position === TMovePosition.on) {
            return new Promise((resolve) => {
                import('Controls/operations').then((operations) => {
                    const sourceAdapter = source.getAdapter();
                    const callFilter = {
                        ...filter,
                        selection: operations.selectionToRecord(selection, sourceAdapter)
                    };
                    source.call(source.getBinding().move, {
                        method: source.getBinding().list,
                        filter: Record.fromObject(callFilter, sourceAdapter),
                        folder_id: targetKey
                    }).then(() => {
                        resolve();
                    });
                });
            })
        }
        return this._source.move(selection.selected, targetKey, {
            position,
            parentProperty: this._parentProperty
        });
    }

    /**
     * Производит проверку переданного объекта с идентификаторами элементов для перемещения.
     * Если список идентификаторов пуст, возвращает false и выводит окно с текстом, иначе возвращает true.
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
