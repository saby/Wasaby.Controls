import CollectionItem from '../CollectionItem';
import IItemActions from '../interface/IItemActions';

export default class ItemActionsManager {
    private _activeItem: CollectionItem<unknown> = null;

    setItemActions(item: CollectionItem<unknown>, actions: IItemActions): void {
        item.setActions(actions);
    }

    setActiveItem(item: CollectionItem<unknown>): void {
        this._activeItem = item;
    }

    getActiveItem(): CollectionItem<unknown> {
        return this._activeItem;
    }
}
