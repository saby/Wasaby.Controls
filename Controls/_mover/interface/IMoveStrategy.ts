import {BindingMixin, DataSet, ICrudPlus, IData, IRpc} from 'Types/source';
import {ISelectionObject, TKeySelection, TKeysSelection, TSelectionRecord} from 'Controls/interface';
import {Model} from 'Types/entity';
import {RecordSet} from "Types/collection";

/**
 * Необходимо для обратной совместимости со старой логикой
 */
export enum MOVE_TYPE {
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

export interface IStrategyOptions extends ITreeStrategyOptions {
    source: ISource;
    sortingOrder: string;
    items: RecordSet;
    keyProperty: string;
}

export interface IMoveStrategy<T> {
    moveItems(items: T, targetId: TKeySelection, position: MOVE_POSITION, moveType?: string): Promise<DataSet|void>;
    getModel(item: TMoveItem): Model;
    getId(item: TMoveItem): TKeySelection;
    /**
     * Ищет ближайших соседей для текущего item
     * @param item
     * @param position
     */
    getSiblingItem(item: TMoveItem, position: MOVE_POSITION): Model;
    /**
     * Получает промис со списком выделенных записей
     * Единственный способ избавиться от коллбека - вынести сейчас этот метод в публичные. Он не понадобится,
     * когда получится избавиться от старой логики.
     * @param items
     * @param target
     * @param position
     * @private
     */
    getSelectedItems(items: TMoveItems, target?: Model, position?: MOVE_POSITION): Promise<TMoveItems>;
}
