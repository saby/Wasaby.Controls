import {IMoveDialogOptions} from './IMoveDialogOptions';
import {RecordSet} from 'Types/collection';
import {Memory, SbisService} from 'Types/source';

/**
 * Интерфейс опций контроллера
 * @interface Controls/_list/interface/IMoveControllerOptions
 * @mixes Controls/_interface/IHierarchy
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Move controller options interface
 * @interface Controls/_list/interface/IMoveControllerOptions
 * @mixes Controls/_interface/IHierarchy
 * @public
 * @author Аверкиев П.А.
 */
export interface IMoveControllerOptions {
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#keyProperty
     * @cfg {String} Имя свойства, содержащего идентификатор элемента коллекции
     */
    /*
     * @name Controls/_list/interface/IMoveDialogOption#keyProperty
     * @cfg {String} Name of the item property that uniquely identifies collection item.
     */
    keyProperty?: string;
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#source
     * @cfg {TSource} Ресурс, в котором производится перемещение
     */
    /*
     * @name Controls/_list/interface/IMoveDialogOption#source
     * @cfg {TSource} Source to perform items move
     */
    source?: SbisService|Memory;
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#items
     * @cfg {Types/collection:RecordSet} Список, в котором производится перемещение согласно старой логике
     */
    /*
     * @name Controls/_list/interface/IMoveDialogOption#items
     * @cfg {Types/collection:RecordSet} Set of records, in that items are moved according to old logic
     */
    items?: RecordSet;
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#dialog
     * @cfg {Controls/_list/interface/IMoveDialogOptions} опции диалога перемещения
     */
    /*
     * @name Controls/_list/interface/IMoveControllerOptions#dialog
     * @cfg {Controls/_list/interface/IMoveDialogOptions} move dialog options
     */
    dialog?: IMoveDialogOptions
    /**
     * @name Controls/_list/interface/IMoveControllerOptions#root
     * @cfg {Controls/_list/interface/IMoveDialogOptions} Корень дерева для создания Collection при поиске ближайших записей
     */
    /*
     * @name Controls/_list/interface/IMoveControllerOptions#root
     * @cfg {Controls/_list/interface/IMoveDialogOptions} Tree root to create Collection while finding siblings
     */
    root?: string;
    parentProperty?: string;
    nodeProperty?: string;
}
