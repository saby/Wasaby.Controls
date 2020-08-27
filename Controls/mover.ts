/**
 * Библиотека контроллера, отвечающего за перемещение элементов
 * @library Controls/mover
 * @includes Controller Controls/_mover/Controller
 * @includes IMoveStrategy Controls/_mover/TMoveItems/IMoveStrategy
 * @author Аверкиев П.А.
 */

export {Controller, IControllerOptions} from 'Controls/_mover/Controller';
export {TMoveItems, MOVE_POSITION, MOVE_TYPE, TMoveItem} from 'Controls/_mover/interface/IMoveStrategy';
