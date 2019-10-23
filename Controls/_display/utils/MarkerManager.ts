import BaseManager from './BaseManager';

export interface IMarkerManageableItem {
    setMarked(marked: boolean): void;
}

export default class MarkerManager extends BaseManager {
    protected _lastMarkedItem: IMarkerManageableItem;

    markItem(item: IMarkerManageableItem): void {
        if (item === this._lastMarkedItem) {
            return;
        }
        if (this._lastMarkedItem) {
            this._lastMarkedItem.setMarked(false);
        }
        if (item) {
            item.setMarked(true);
        }
        this._lastMarkedItem = item;
    }

    getMarkedItem(): IMarkerManageableItem {
        return this._lastMarkedItem;
    }
}
