import {IMoveDialogOptions} from './IMoveDialogOptions';
import {RecordSet} from "Types/collection";
import {BindingMixin, ICrudPlus, IData, IRpc} from "Types/source";

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
    root?: string;
    parentProperty?: string;
    nodeProperty?: string;
    filter?: any;
}

/**
 * Интерфейс опций контроллера
 * @interface Controls/_list/interface/IMoveOptions
 * @mixes Controls/_interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Move controller options interface
 * @interface Controls/_list/interface/IMoveOptions
 * @mixes Controls/_interface/IMovable
 * @mixes Controls/_interface/IHierarchy
 * @public
 * @author Аверкиев П.А.
 */
export interface IMoveOptions extends ITreeStrategyOptions {
    /**
     * @name Controls/_list/interface/IMoveOptions#keyProperty
     * @cfg {String} Имя свойства, содержащего идентификатор элемента коллекции
     */
    /*
     * @name Controls/_list/interface/IMoveDialogOption#keyProperty
     * @cfg {String} Name of the item property that uniquely identifies collection item.
     */
    keyProperty?: string;
    /**
     * @name Controls/_list/interface/IMoveOptions#source
     * @cfg {TSource} Ресурс, в котором производится перемещение
     */
    /*
     * @name Controls/_list/interface/IMoveDialogOption#source
     * @cfg {TSource} Source to perform items move
     */
    source?: TSource;
    /**
     * @name Controls/_list/interface/IMoveOptions#items
     * @cfg {Types/collection:RecordSet} Список, в котором производится перемещение согласно старой логике
     */
    /*
     * @name Controls/_list/interface/IMoveDialogOption#items
     * @cfg {Types/collection:RecordSet} Set of records, in that items are moved according to old logic
     */
    items?: RecordSet;
    /**
     * @name Controls/_list/interface/IMoveOptions#dialog
     * @cfg {Controls/_list/interface/IMoveDialogOptions} опции диалога перемещения
     */
    /*
     * @name Controls/_list/interface/IMoveOptions#dialog
     * @cfg {Controls/_list/interface/IMoveDialogOptions} move dialog options
     */
    dialog?: IMoveDialogOptions
}
