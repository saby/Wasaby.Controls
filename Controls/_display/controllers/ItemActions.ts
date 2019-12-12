import Collection from '../Collection';
import { updateCollection, getItemByKey, updateCollectionWithCachedItem } from './controllerUtils';

import { showType } from 'Controls/Utils/Toolbar';

// TODO Написать реальный тип для action'ов
type TItemAction = any;

export type TItemActionVisibilityCallback = (action: TItemAction, item: unknown) => boolean;

interface IItemActionsContainer {
    all: TItemAction[];
    showed: TItemAction[];
}

export interface IItemActionsItem {
    getActions(): IItemActionsContainer;
    getContents(): unknown;
    setActions(actions: IItemActionsContainer): void;
    setActive(active: boolean): void;
}

const ITEM_ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size';

const CACHE_ACTIVE_ITEM = 'activeItem';

export function assignActions(
    collection: Collection<unknown>,
    actions: TItemAction[],
    visibilityCallback: TItemActionVisibilityCallback = () => true
): void {
    updateCollection(collection, () => {
        const fixedActions = actions.map(_fixActionIcon);
        collection.setEventRaising(false, true);
        collection.each((item: IItemActionsItem) => {
            const actionsForItem = fixedActions.filter((action) => visibilityCallback(action, item.getContents()));
            _setItemActions(item, _wrapActionsInContainer(actionsForItem));
        });
        collection.setEventRaising(true, true);
    });
}

export function setActionsToItem(
    collection: Collection<unknown>,
    key: string|number,
    actions: IItemActionsContainer
): void {
    updateCollection(collection, () => {
        const item: IItemActionsItem = getItemByKey(collection, key);
        if (item) {
            _setItemActions(item, actions);
        }
    });
}

export function setActiveItem(collection: Collection<unknown>, key: string|number): void {
    updateCollectionWithCachedItem(collection, CACHE_ACTIVE_ITEM, (oldActiveItem: IItemActionsItem) => {
        const newActiveItem: IItemActionsItem = getItemByKey(collection, key);

        if (oldActiveItem) {
            oldActiveItem.setActive(false);
        }
        if (newActiveItem) {
            newActiveItem.setActive(true);
        }

        return newActiveItem;
    });
}

export function getActiveItem(collection: Collection<unknown>): IItemActionsItem {
    return collection.getCacheValue(CACHE_ACTIVE_ITEM);
}

export function getMenuActions(item: IItemActionsItem): TItemAction[] {
    const actions = item.getActions();
    return actions && actions.all && actions.all.filter(
        (action) => action.showType !== showType.TOOLBAR
    );
}

export function getChildActions(item: IItemActionsItem, parentAction: TItemAction): TItemAction[] {
    const actions = item.getActions();
    const allActions = actions && actions.all;
    if (allActions) {
        const parentId = parentAction.id;
        return allActions.filter((action) => action.parent === parentId);
    }
    return [];
}

function _setItemActions(item: IItemActionsItem, actions: IItemActionsContainer): void {
    const oldActions = item.getActions();
    if (!oldActions || (actions && !_isMatchingActions(oldActions, actions))) {
        item.setActions(actions);
    }
}

function _fixActionIcon(action: TItemAction): TItemAction {
    if (!action.icon || action.icon.includes(ITEM_ACTION_ICON_CLASS)) {
        return action;
    }
    return {
        ...action,
        icon: `${action.icon} ${ITEM_ACTION_ICON_CLASS}`
    };
}

function _wrapActionsInContainer(actions: TItemAction[]): IItemActionsContainer {
    let showed = actions;
    if (showed.length > 1) {
        showed = showed.filter(
            (action) => action.showType === showType.TOOLBAR || action.showType === showType.MENU_TOOLBAR
        );
        if (_isMenuButtonRequired(actions)) {
            showed.push({
                icon: `icon-ExpandDown ${ITEM_ACTION_ICON_CLASS}`,
                style: 'secondary',
                iconStyle: 'secondary',
                _isMenu: true
            });
        }
    }
    return {
        all: actions,
        showed
    };
}

function _isMenuButtonRequired(actions: TItemAction[]): boolean {
    return actions.some((action) => {
        return (
            !action.parent &&
            (
                !action.showType ||
                action.showType === showType.MENU ||
                action.showType === showType.MENU_TOOLBAR
            )
        );
    });
}

function _isMatchingActions(oldContainer: IItemActionsContainer, newContainer: IItemActionsContainer): boolean {
    return (
        _isMatchingActionLists(oldContainer.all, newContainer.all) &&
        _isMatchingActionLists(oldContainer.showed, newContainer.showed)
    );
}

function _isMatchingActionLists(aActions: TItemAction[], bActions: TItemAction[]): boolean {
    if (!aActions || !bActions) {
        return false;
    }
    const length = aActions.length;
    if (length !== bActions.length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (
            aActions[i].id !== bActions[i].id ||
            aActions[i].icon !== bActions[i].icon
        ) {
            return false;
        }
    }
    return true;
}
