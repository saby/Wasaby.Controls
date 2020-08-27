import {IStrategyOptions} from './IStrategyOptions';
import {IMoveDialogOptions} from './IMoveDialogOptions';

/**
 * Интерфейс опций контроллера
 * @interface Controls/_mover/interface/IControllerOptions
 * @mixes Controls/_mover/interface/IStrategyOptions
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Move controller options interface
 * @interface Controls/_mover/interface/IControllerOptions
 * @mixes Controls/_mover/interface/IStrategyOptions
 * @public
 * @author Аверкиев П.А.
 */
export interface IControllerOptions extends IStrategyOptions {
    /**
     * @name Controls/_mover/interface/IControllerOptions#dialog
     * @cfg {Controls/_mover/interface/IMoveDialogOptions} опции диалога перемещения
     */
    /*
     * @name Controls/_mover/interface/IControllerOptions#dialog
     * @cfg {Controls/_mover/interface/IMoveDialogOptions} move dialog options
     */
    dialog?: IMoveDialogOptions
}
