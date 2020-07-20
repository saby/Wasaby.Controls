/**
 * Библиотека, которая предоставляет операции с записью коллекции
 * @library Controls/itemActions
 * @includes TreeItem Controls/_itemActions/Controller
 * @public
 * @author Аверкиев П.А.
 */

/**
 * Library that provides collection item actions
 * @library Controls/itemActions
 * @includes TreeItem Controls/_itemActions/Controller
 * @public
 * @author Аверкиев П.А.
 */

export {
    TItemActionVisibilityCallback,
    TEditArrowVisibilityCallback,
    IItemActionsContainer,
    IItemAction,
    TItemActionShowType,
    TItemActionsPosition
} from './_itemActions/interface/IItemActions';
export {IContextMenuConfig} from './_itemActions/interface/IContextMenuConfig';
export {IItemActionsItem, IItemActionsCollection, Controller} from './_itemActions/Controller';
export {Utils} from './_itemActions/Utils';

import * as ItemActionsForTemplate from 'wml!Controls/_itemActions/resources/templates/ItemActionsFor';
import * as ItemActionsTemplate from 'wml!Controls/_itemActions/resources/templates/ItemActionsTemplate';
import * as SwipeActionTemplate from 'wml!Controls/_itemActions/resources/templates/SwipeAction';
import * as SwipeActionsTemplate from 'wml!Controls/_itemActions/resources/templates/SwipeTemplate';

export {
    ItemActionsForTemplate,
    ItemActionsTemplate,
    SwipeActionTemplate,
    SwipeActionsTemplate
};
