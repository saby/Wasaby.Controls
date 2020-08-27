import {DataSet} from 'Types/source';
import {ISelectionObject, TKeySelection, TKeysSelection, TSelectionRecord} from 'Controls/interface';
import {Model} from 'Types/entity';
import {IMoveObject} from './IMoveObject';

/**
 * @typedef {Controls/interface:TKeySelection|Types/entity:Model} TMoveItem
 * @description
 * Перемещаемый элемент. Может быть Моделью или Id
 * @see Controls/interface:TKeySelection
 */
export type TMoveItem = Model|TKeySelection


/**
 * @typedef {Array<TMoveItem>|Controls/_mover/interface/IMoveObject|Controls/interface:TSelectionRecord|Controls/interface:ISelectionObject} TMoveItems
 * @description
 * Перемещаемые элементы. Может быть набором Моделей или Id или Объектом ISelectionObject, объектом IMoveObject, или TSelectionRecord
 * @see Controls/_mover/interface/IMoveObject
 * @see Controls/interface:TSelectionRecord
 * @see Controls/interface:ISelectionObject
 * @see ISelectionObject
 * @see TMoveItem
 */
export type TMoveItems = TMoveItem[]|IMoveObject|ISelectionObject|TSelectionRecord;

/**
 * @typedef {String} MOVE_POSITION
 * @description
 * Тип перемещения - в items/source или custom
 */
export enum MOVE_TYPE {
    CUSTOM = 'Custom',
    MOVE_IN_ITEMS = 'MoveInItems'
}

/**
 * @typedef {String} MOVE_POSITION
 * @description
 * Позиция для перемещения записи
 */
export enum MOVE_POSITION {
    on = 'on',
    before = 'before',
    after = 'after'
}

/**
 * Интерфейс стратегии перемещения
 * @interface Controls/_mover/interface/IStrategyOptions
 * @mixes Controls/_interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @private
 * @author Аверкиев П.А.
 */

/*
 * Move strategy interface
 * @interface Controls/_mover/interface/IStrategyOptions
 * @mixes Controls/_interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @private
 * @author Аверкиев П.А.
 */
export interface IMoveStrategy<T> {
    /**
     * Позволяет переместить запись относительно указанного элемента
     * @param items
     * @param targetId
     * @param position
     * @param moveType
     */
    moveItems(items: T, targetId: TKeySelection, position: MOVE_POSITION, moveType?: string): Promise<DataSet|void>;

    /**
     * Получает Model записи
     * @param item
     */
    getModel(item: TMoveItem): Model;

    /**
     * Получает key записи
     * @param item
     */
    getId(item: TMoveItem): TKeySelection;

    /**
     * Получает элемент, к которому производится перемещение
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
    getItems(items: TMoveItems, target?: Model, position?: MOVE_POSITION): Promise<TMoveItems>;

    /**
     * Запрос ключей выбранных записей
     * @param items
     */
    getSelectedKeys(items: TMoveItems): TKeysSelection;
}
