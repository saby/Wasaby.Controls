import CollectionItem from '../CollectionItem';

export default class MarkerManager {
    private _lastMarkedItem: CollectionItem<unknown>;

    public markItem(item: CollectionItem<unknown>): void {
        if (item === this._lastMarkedItem) {
            return;
        }
        if (item) {
            item.setMarked(true);
        }
        if (this._lastMarkedItem) {
            this._lastMarkedItem.setMarked(false);
        }
        this._lastMarkedItem = item;
    }
}
