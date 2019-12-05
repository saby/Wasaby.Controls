import BaseManager from './BaseManager';

interface ISwipeManageableItem {
    setSwiped(swiped: boolean): void;
}

export default class SwipeManager extends BaseManager {
    protected _swipedItem: ISwipeManageableItem;

    setSwipeItem(item: ISwipeManageableItem): void {
        if (item === this._swipedItem) {
            return;
        }
        if (this._swipedItem) {
            this._swipedItem.setSwiped(false);
        }
        if (item) {
            item.setSwiped(true);
        }
        this._swipedItem = item;
    }

    getSwipeItem(): ISwipeManageableItem {
        return this._swipedItem;
    }
}
