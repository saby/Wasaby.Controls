import {TileView} from 'Controls/tileNew';
import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';
import { SyntheticEvent } from 'UI/Vdom';

export default class TreeTileView extends TileView {
    protected _shouldOpenExtendedMenu(isActionMenu: boolean, isContextMenu: boolean, item: TreeTileCollectionItem): boolean {
        return super._shouldOpenExtendedMenu(isActionMenu, isContextMenu, item) && !item.isNode();
    }

    protected _calculateHoveredItemPosition(event: SyntheticEvent, item: TreeTileCollectionItem, documentForUnits?: boolean): void {
        if (event.target.closest('.js-controls-TileView__withoutZoom') && item.isNode()) {
            const itemContainer = event.target.closest('.controls-TileView__item');
            const itemContainerRect = itemContainer.getBoundingClientRect();
            this._setHoveredItem(item, null, null, null, itemContainerRect.width);
        } else {
            super._calculateHoveredItemPosition(event, item, documentForUnits);
        }
    }

    protected _setHoveredItem(item: TreeTileCollectionItem, position: string, startPosition: string, noZoom: boolean, itemWidth?: number): void {
        super._setHoveredItem(item, position, startPosition, noZoom, itemWidth);
    }
}
