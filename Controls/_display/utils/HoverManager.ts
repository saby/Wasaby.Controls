import BaseManager from './BaseManager';

export interface IHoverManageableItem {
    setHovered(hovered: boolean): void;
}

export default class HoverManager extends BaseManager {
    protected _hoveredItem: IHoverManageableItem;

    setHoveredItem(item: IHoverManageableItem): void {
        if (this._hoveredItem === item) {
            return;
        }
        if (this._hoveredItem) {
            this._hoveredItem.setHovered(false);
        }
        if (item) {
            item.setHovered(true);
        }
        this._hoveredItem = item;
    }

    getHoveredItem(): IHoverManageableItem {
        return this._hoveredItem;
    }
}
