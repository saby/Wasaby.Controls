import {TileView} from 'Controls/tileNew';
import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';
import { SyntheticEvent } from 'UI/Vdom';

export default class TreeTileView extends TileView {
    protected _shouldOpenExtendedMenu(isActionMenu: boolean, isContextMenu: boolean, item: TreeTileCollectionItem): boolean {
        return super._shouldOpenExtendedMenu(isActionMenu, isContextMenu, item) && !item.isNode();
    }
}
