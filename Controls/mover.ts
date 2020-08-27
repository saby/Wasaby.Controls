/**
 * Библиотека контроллера, отвечающего за перемещение элементов
 * @library Controls/mover
 * @includes Controller Controls/_mover/Controller
 * @includes IMoveStrategy Controls/_mover/TMoveItems/IMoveStrategy
 * @author Аверкиев П.А.
 */

export {Controller} from 'Controls/_mover/Controller';
export {IControllerOptions} from 'Controls/_mover/interface/IControllerOptions';
export {TMoveItems, MOVE_POSITION, MOVE_TYPE, TMoveItem} from 'Controls/_mover/interface/IMoveStrategy';
