import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {BindingMixin, DataSet, ICrudPlus, IData, IRpc} from 'Types/source';
import {ISelectionObject, TKeySelection, TKeysSelection, TSelectionRecord} from 'Controls/interface';
import {Model} from 'Types/entity';
import {IMovableItem} from './IMovableItem';
import {RecordSet} from "Types/collection";

export enum BEFORE_ITEMS_MOVE_RESULT {
    CUSTOM = 'Custom',
    MOVE_IN_ITEMS = 'MoveInItems'
}

export enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
}

/**
 * Объект для перемещения в новой логике
 */
export interface IMoveObject {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    filter: object;
}

/**
 * Перемещаемый элемент. Может быть Моделью или Id
 */
export type TMoveItem = Model|TKeySelection

/**
 * @todo проверить, все ли варианты нужны
 * Перемещаемые элементы. Может быть набором Моделей или Id или Объектом ISelectionObject, объектом IMoveObject, или TSelectionRecord
 */
export type TMoveItems = TMoveItem[]|IMoveObject|ISelectionObject|TSelectionRecord;

/**
 * Ресурс данных, внутри которго происходит перемещение. Обладает свойствами Crud, Binding, RPC, Data
 */
export interface ISource extends IData, IRpc, ICrudPlus, BindingMixin {}

// @mixes Controls/interface/IMovable
// @mixes Controls/_interface/IHierarchy
export interface ITreeStrategyOptions {
    root: string;
    parentProperty: string;
    nodeProperty: string;
    filter: any;
    searchParam: string;
}

export interface IMoveDialogOptions {
    /**
     * Необходим для moverDialog
     */
    opener: Control<IControlOptions, unknown> | null;
    moveDialogOptions?: any; //@todo Разобрать опции для шаблона moveDialog
    moveDialogTemplate?: TemplateFunction;
}

export interface IStrategyOptions extends ITreeStrategyOptions, IMoveDialogOptions {
    source: ISource;
    sortingOrder: string;
    items: RecordSet;
    keyProperty: string;
    // @todo Как избавиться от колбека?
    beforeItemsMove: (items: TMoveItems, target: IMovableItem, position: MOVE_POSITION) => Promise<any>;
    // @todo Как избавиться от колбека?
    afterItemsMove: (items: TMoveItems, target, position: MOVE_POSITION, result) => void;
}

export interface IMoveStrategy<T> {
    moveItems(items: T, target: IMovableItem, position): Promise<DataSet|void>;
    moveItemsWithDialog(items: T, template: TemplateFunction): void;
    getModel(item: TMoveItem): Model;
    getId(item: TMoveItem): TKeySelection;
    // TODO Надо понять, может ли контроллер работать с Collection и тогда может быть этот метот сократится
    getSiblingItem(item: TMoveItem, position: MOVE_POSITION);
}
