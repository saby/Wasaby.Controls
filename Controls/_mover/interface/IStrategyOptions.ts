import {RecordSet} from 'Types/collection';
import {BindingMixin, ICrudPlus, IData, IRpc} from 'Types/source';

/**
 * @typedef {Types/source:BindingMixin|Types/source:ICrudPlus|Types/source:IRpc|Types/source:IData} TMoveSource
 * @description
 * Ресурс данных, внутри которого происходит перемещение. Обладает свойствами Crud, Binding, RPC, Data
 * @see Types/source:BindingMixin
 * @see Types/source:ICrudPlus
 * @see Types/source:IRpc
 * @see Types/source:IData
 */
export type TSource = IData|IRpc|ICrudPlus|BindingMixin;

export interface ITreeStrategyOptions {
    root: string;
    parentProperty: string;
    nodeProperty: string;
    filter: any;
    searchParam: string;
}

/**
 * Интерфейс опций стратегии перемещения
 * @interface Controls/_mover/interface/IStrategyOptions
 * @mixes Controls/_interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Move strategy options interface
 * @interface Controls/_mover/interface/IStrategyOptions
 * @mixes Controls/_interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @public
 * @author Аверкиев П.А.
 */
export interface IStrategyOptions extends ITreeStrategyOptions {
    /**
     * @name Controls/_mover/interface/IStrategyOptions#source
     * @cfg {TSource} Ресурс, в котором производится перемещение
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#source
     * @cfg {TSource} Source to perform items move
     */
    source: TSource;
    /**
     * @name Controls/_mover/interface/IStrategyOptions#sortingOrder
     * @cfg {String} Направление сортировки, напр. asc, desc
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#sortingOrder
     * @cfg {String} Sorting order, ie. asc, desc
     */
    sortingOrder: string;
    /**
     * @name Controls/_mover/interface/IStrategyOptions#items
     * @cfg {Types/collection:RecordSet} Список, в котором производится перемещение согласно старой логике
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#items
     * @cfg {Types/collection:RecordSet} Set of records, in that items are moved according to old logic
     */
    items: RecordSet;
    /**
     * @name Controls/_mover/interface/IStrategyOptions#keyProperty
     * @cfg {String} Имя свойства, содержащего идентификатор элемента коллекции
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#keyProperty
     * @cfg {String} Name of the item property that uniquely identifies collection item.
     */
    keyProperty: string;
}
