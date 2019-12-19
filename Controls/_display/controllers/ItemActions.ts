import { IBaseCollection, TItemKey } from '../interface';
import { showType } from 'Controls/Utils/Toolbar';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';

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
    destroyed: boolean;
    each(cb: (item: IItemActionsItem) => void): void;
    setEventRaising?(raising: boolean, analyze?: boolean): void;
    areActionsAssigned(): boolean;
    setActionsAssigned(assigned: boolean): void;
    setActionsMenuConfig(config: any): void;
    getActionsMenuConfig(): any;
    getContextMenuConfig(): any;
}

const ITEM_ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size';

export function assignActions(
    collection: IItemActionsCollection,
    actions: TItemAction[],
    visibilityCallback: TItemActionVisibilityCallback = () => true
): void {
    if (collection.areActionsAssigned()) {
        return;
    }

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

    collection.setActionsAssigned(true);

    collection.nextVersion();
}

export function resetActionsAssignment(collection: IItemActionsCollection): void {
    collection.setActionsAssigned(false);
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
    parentActionKey: TItemAction
): TItemAction[] {
    const actions = item.getActions();
    const allActions = actions && actions.all;
    if (allActions) {
        return allActions.filter((action) => action.parent === parentActionKey);
    }
    return [];
}

export function processActionClick(
    collection: IItemActionsCollection,
    itemKey: TItemKey,
    action: TItemAction,
    clickEvent: SyntheticEvent<MouseEvent>,
    fromDropdown: boolean
): void {
    clickEvent.stopPropagation();
    if (action._isMenu) {
        prepareActionsMenuConfig(collection, itemKey, clickEvent, null, false);
    } else if (action['parent@']) {
        if (!fromDropdown) {
            prepareActionsMenuConfig(collection, itemKey, clickEvent, action, false);
        }
    } else {
        const item = collection.getItemBySourceKey(itemKey);
        if (item) {
            const contents = item.getContents();

            // How to fire from here???
            // this._notify('actionClick', [action, contents, itemContainer]);

            if (action.handler) {
                action.handler(contents);
            }
        }
    }
    // TODO update some item actions
    // TODO move the marker
}

export function prepareActionsMenuConfig(
    collection: IItemActionsCollection,
    itemKey: TItemKey,
    clickEvent: SyntheticEvent<MouseEvent>,
    parentAction: TItemAction,
    isContext: boolean
): void {
    const item = collection.getItemBySourceKey(itemKey);
    if (!item) {
        return;
    }

    const hasParentAction = parentAction !== null && parentAction !== undefined;
    const menuActions = hasParentAction
        ? getChildActions(item, parentAction.id)
        : getMenuActions(item);

    if (menuActions && menuActions.length > 0) {
        // there was a fake target before, check if it is needed
        const menuTarget = isContext ? null : clickEvent.target;
        const closeHandler = _processActionsMenuClose.bind(null, collection);
        const menuRecordSet = new RecordSet({
            rawData: menuActions,
            keyProperty: 'id'
        });
        const headConfig = hasParentAction ? { caption: parentAction.title } : null;
        const contextMenuConfig = collection.getContextMenuConfig();
        const menuConfig = {
            items: menuRecordSet,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            dropdownClassName: 'controls-itemActionsV__popup',
            showClose: true,
            ...contextMenuConfig,
            rootKey: parentAction,
            showHeader: hasParentAction,
            headConfig
        };
        const dropdownConfig = {
            // opener: this,
            target: menuTarget,
            templateOptions: menuConfig,
            eventHandlers: {
                onResult: closeHandler,
                onClose: closeHandler
            },
            closeOnOutsideClick: true,
            targetPoint: {
                vertical: 'top',
                horizontal: 'right'
            },
            direction: {
                horizontal: isContext ? 'right' : 'left'
            },
            className: 'controls-DropdownList__margin-head controls-Toolbar__popup__list_theme-',
            nativeEvent: isContext ? clickEvent.nativeEvent : false
        };

        setActiveItem(collection, itemKey);
        collection.setActionsMenuConfig(dropdownConfig);

        collection.nextVersion();
    }
}

function _processActionsMenuClose(
    collection: IItemActionsCollection,
    args?: { action: string, event: SyntheticEvent<MouseEvent>, data: any[] }
): void {
    // Actions dropdown can start closing after the view itself was unmounted already, in which case
    // the model would be destroyed and there would be no need to process the action itself
    if (collection && !collection.destroyed) {
        // If menu needs to close because one of the actions was clicked, process
        // the action handler first
        if (args && args.action === 'itemClick') {
            const action = args.data && args.data[0] && args.data[0].getRawData();
            processActionClick(
                collection,
                getActiveItem(collection)?.getContents()?.getKey(),
                action,
                args.event,
                true
            );

            // If this action has children, don't close the menu if it was clicked
            if (action['parent@']) {
                return;
            }
        }

        setActiveItem(collection, null);
        collection.setActionsMenuConfig(null);

        collection.nextVersion();
    }
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
