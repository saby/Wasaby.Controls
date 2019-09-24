import CollectionItem from '../CollectionItem';

export default class ItemActionsManager {
    private _activeItem: CollectionItem<unknown> = null;

    setItemActions(item: CollectionItem<unknown>, actions: any): void {
        const oldActions = item.getActions();
        if (!oldActions || (actions && !this._isMatchingActions(oldActions, actions))) {
            item.setActions(actions);
        }
    }

    setActiveItem(item: CollectionItem<unknown>): void {
        this._activeItem = item;
    }

    getActiveItem(): CollectionItem<unknown> {
        return this._activeItem;
    }

    private _isMatchingActions(oldActionsObj: any, newActionsObj: any): boolean {
        return (
            this._isMatchingActionIds(oldActionsObj.all, newActionsObj.all) &&
            this._isMatchingActionIds(oldActionsObj.showed, newActionsObj.showed)
        );
    }

    private _isMatchingActionIds(aActions: any[], bActions: any[]): boolean {
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
