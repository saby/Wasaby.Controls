/**
 * Библиотека, которая предоставляет операции с записью коллекции
 * @library Controls/itemActions
 * @includes TreeItem Controls/_itemActions/ItemActionsController
 * @public
 * @author Аверкиев П.А.
 */

/**
 * Library that provides collection item actions
 * @library Controls/itemActions
 * @includes TreeItem Controls/_itemActions/ItemActionsController
 * @public
 * @author Аверкиев П.А.
 */

export {
    TItemActionVisibilityCallback,
    IItemActionsItem,
    IItemActionsCollection,
    TActionClickCallback,
    IItemActionsContainer,
    IMenuActionHandler,
    IMenuConfig,
    IItemAction
} from './_itemActions/interface/IItemActions';
export {ItemActionsController} from './_itemActions/ItemActionsController';
