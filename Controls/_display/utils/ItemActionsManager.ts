import CollectionItem from '../CollectionItem';

export default class ItemActionsManager {
    private _activeItem: CollectionItem<unknown> = null;

    setItemActions(item: CollectionItem<unknown>, actions: any): void {
        item.setActions(actions);
    }

    setActiveItem(item: CollectionItem<unknown>): void {
        this._activeItem = item;
    }

    getActiveItem(): CollectionItem<unknown> {
        return this._activeItem;
    }
}
