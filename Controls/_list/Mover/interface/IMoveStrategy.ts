import {TemplateFunction} from 'UI/Base';
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
 * Перемещаемые элементы. Может быть набором Моделей или Id или Объектом ISelectionObject или объектом IMoveObject
 */
export type TMoveItems = TMoveItem[]|IMoveObject|ISelectionObject|TSelectionRecord;

/**
 * Ресурс данных, внутри которго происходит перемещение. Обладает свойствами Crud, Binding, RPC, Data
 */
export interface ISource extends IData, IRpc, ICrudPlus, BindingMixin {}

export interface ITreeStrategyOptions {
    root: string;
    parentProperty: string;
    nodeProperty: string;
    filter: any;
    searchParam: string;
}

export interface IStrategyOptions extends ITreeStrategyOptions {
    source: ISource;
    sortingOrder: string;
    items: RecordSet; // @todo Может быть заменится на collection ?
    keyProperty: string;
    moveDialogOptions: any; //@todo Разобрать опции для шаблона moveDialog
}

export interface IMoveStrategy<T> {
    moveItems(items: T, target: IMovableItem, position): Promise<DataSet|void>;
    moveItemsWithDialog(items: T, template: TemplateFunction): void;
    getModel(item: TMoveItem): Model;
    getId(item: TMoveItem): TKeySelection;
}
