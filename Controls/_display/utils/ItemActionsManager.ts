import BaseManager from './BaseManager';

// TODO Написать реальный тип для action'ов
type TItemAction = any;
interface IItemActionsContainer {
    all: TItemAction[];
    showed: TItemAction[];
}

export interface IItemActionsManageableItem {
    getActions(): IItemActionsContainer;
    setActions(actions: IItemActionsContainer): void;
    setActive(active: boolean): void;
}

export default class ItemActionsManager extends BaseManager {
    protected _activeItem: IItemActionsManageableItem;

    setItemActions(item: IItemActionsManageableItem, actions: IItemActionsContainer): void {
        const oldActions = item.getActions();
        if (!oldActions || (actions && !this._isMatchingActions(oldActions, actions))) {
            item.setActions(actions);
        }
    }

    setActiveItem(item: IItemActionsManageableItem): void {
        if (this._activeItem === item) {
            return;
        }
        if (this._activeItem) {
            this._activeItem.setActive(false);
        }
        if (item) {
            item.setActive(true);
        }
        this._activeItem = item;
    }

    getActiveItem(): IItemActionsManageableItem {
        return this._activeItem;
    }

    protected _isMatchingActions(oldContainer: IItemActionsContainer, newContainer: IItemActionsContainer): boolean {
        return (
            this._isMatchingActionIds(oldContainer.all, newContainer.all) &&
            this._isMatchingActionIds(oldContainer.showed, newContainer.showed)
        );
    }

    protected _isMatchingActionIds(aActions: TItemAction[], bActions: TItemAction[]): boolean {
        if (!aActions || !bActions) {
            return false;
        }
        const length = aActions.length;
        if (length !== bActions.length) {
            return false;
        }
        for (let i = 0; i < length; i++) {
            if (aActions[i].id !== bActions[i].id) {
                return false;
            }
        }
        return true;
    }
}
