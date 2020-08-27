import {Control, IControlOptions} from 'UI/Base';
import {Model} from 'Types/entity';
import {TMoveItems} from './IMoveStrategy';

/**
 * @typedef {Function} TOnResultHandler
 * @description
 * Обработчик результата перемещения в диалоге
 * @param {Controls/_mover/interface/IMoveStrategy/TMoveItems.typedef} items элементы, которые необходимо переместить
 * @param {Types/entity:Model} target элемент, к которому производится перемещение
 */
type TOnResultHandler = (items: TMoveItems, target: Model) => void;

/**
 * Интерфейс опций диалога перемещения
 * @interface Controls/_mover/interface/IMoveDialogOptions
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Move dialog options
 * @interface Controls/_mover/interface/IMoveDialogOptions
 * @public
 * @author Аверкиев П.А.
 */
export interface IMoveDialogOptions {
    /**
     * @name Controls/_mover/interface/IMoveDialogOption#opener
     * @cfg {UI/Base:Control} Экземпляр контрола, из которого будет открыт диалог
     */
    /*
     * @name Controls/_mover/Controller/IMoveDialogOption#opener
     * @cfg {UI/Base:Control} Control instance from what the dialog will opened
     */
    opener: Control<IControlOptions, unknown> | null;
    /**
     * @name Controls/_mover/interface/IMoveDialogOption#templateOptions
     * @cfg {Object} Опции для шаблона диалога
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#templateOptions
     * @cfg {Object} dialog template options
     */
    templateOptions?: object;
    /**
     * @name Controls/_mover/interface/IMoveDialogOption#template
     * @cfg {String} Путь к шаблону диалога
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#template
     * @cfg {String} dialog template path
     */
    template?: string;
    /**
     * @name Controls/_mover/interface/IMoveDialogOption#onResultHandler
     * @cfg {TOnResultHandler} Обработчик результата перемещения в диалоге
     */
    /*
     * @name Controls/_mover/interface/IMoveDialogOption#onResultHandler
     * @cfg {TOnResultHandler} Dialog move result handler
     */
    onResultHandler?: TOnResultHandler;
}
