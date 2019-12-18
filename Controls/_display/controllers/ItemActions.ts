import { IBaseCollection, TItemKey } from './interface';
import { showType } from 'Controls/Utils/Toolbar';

// TODO Написать реальный тип для action'ов
type TItemAction = any;

export type TItemActionVisibilityCallback = (
    action: TItemAction,
    item: unknown
) => boolean;

interface IItemActionsContainer {
    all: TItemAction[];
    showed: TItemAction[];
}

export interface IItemActionsItem {
    getActions(): IItemActionsContainer;
    getContents(): unknown;
    setActions(actions: IItemActionsContainer): void;
    setActive(active: boolean): void;
    isActive(): boolean;
}

export interface IItemActionsCollection extends IBaseCollection<IItemActionsItem> {
    each(cb: (item: IItemActionsItem) => void): void;
    setEventRaising?(raising: boolean, analyze?: boolean): void;
}

const ITEM_ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size';

export function assignActions(
    collection: IItemActionsCollection,
    actions: TItemAction[],
    visibilityCallback: TItemActionVisibilityCallback = () => true
): void {
    const supportsEventRaising = typeof collection.setEventRaising === 'function';
    const fixedActions = actions.map(_fixActionIcon);

    if (supportsEventRaising) {
        collection.setEventRaising(false, true);
    }

    collection.each((item) => {
        const actionsForItem = fixedActions.filter((action) =>
            visibilityCallback(action, item.getContents())
        );
        _setItemActions(item, _wrapActionsInContainer(actionsForItem));
    });

    if (supportsEventRaising) {
        collection.setEventRaising(true, true);
    }
    collection.nextVersion();
}

export function setActionsToItem(
    collection: IItemActionsCollection,
    key: TItemKey,
    actions: IItemActionsContainer
): void {
    const item = collection.getItemBySourceKey(key);
    if (item) {
        _setItemActions(item, actions);
    }
    collection.nextVersion();
}

export function setActiveItem(
    collection: IItemActionsCollection,
    key: TItemKey
): void {
    const oldActiveItem = getActiveItem(collection);
    const newActiveItem = collection.getItemBySourceKey(key);

    if (oldActiveItem) {
        oldActiveItem.setActive(false);
    }
    if (newActiveItem) {
        newActiveItem.setActive(true);
    }

    collection.nextVersion();
}

export function getActiveItem(
    collection: IItemActionsCollection
): IItemActionsItem {
    return collection.find((item) => item.isActive());
}

export function getMenuActions(item: IItemActionsItem): TItemAction[] {
    const actions = item.getActions();
    return (
        actions &&
        actions.all &&
        actions.all.filter((action) => action.showType !== showType.TOOLBAR)
    );
}

export function getChildActions(
    item: IItemActionsItem,
    parentAction: TItemAction
): TItemAction[] {
    const actions = item.getActions();
    const allActions = actions && actions.all;
    if (allActions) {
        const parentId = parentAction.id;
        return allActions.filter((action) => action.parent === parentId);
    }
    return [];
}

function _setItemActions(
    item: IItemActionsItem,
    actions: IItemActionsContainer
): void {
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

function _wrapActionsInContainer(
    actions: TItemAction[]
): IItemActionsContainer {
    let showed = actions;
    if (showed.length > 1) {
        showed = showed.filter(
            (action) =>
                action.showType === showType.TOOLBAR ||
                action.showType === showType.MENU_TOOLBAR
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
    return actions.some(
        (action) =>
            !action.parent &&
            (!action.showType ||
                action.showType === showType.MENU ||
                action.showType === showType.MENU_TOOLBAR)
    );
}

function _isMatchingActions(
    oldContainer: IItemActionsContainer,
    newContainer: IItemActionsContainer
): boolean {
    return (
        _isMatchingActionLists(oldContainer.all, newContainer.all) &&
        _isMatchingActionLists(oldContainer.showed, newContainer.showed)
    );
}

function _isMatchingActionLists(
    aActions: TItemAction[],
    bActions: TItemAction[]
): boolean {
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
