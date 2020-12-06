/**
 * Библиотека стандартных действий над записями
 * @library Controls/actions
 * @includes Remove Controls/_actions/Remove
 * @includes IAction Control/_actions/interface/IAction
 * @includes IActionOptions Controls/_actions/interface/IActionOptions
 */

import IAction, {IActionOptions} from './_actions/interface/IAction';
import Remove from './_actions/Remove';

export {
    Remove,
    IAction,
    IActionOptions
}
