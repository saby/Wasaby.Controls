import { CollectionItem } from 'Controls/display';
import {Model} from 'Types/entity';
import { mixin } from 'Types/util';
import TileItem from 'Controls/_tileNew/display/mixins/TileItem';

export default class TileCollectionItem<T extends Model = Model>
    extends mixin<CollectionItem<T>, TileItem<T>>(CollectionItem, TileItem) {
    setActive(active: boolean, silent?: boolean): void {
        // TODO This is copied from TileViewModel, but there must be a better
        // place for it. For example, somewhere in ItemActions container
        if (!active && this.isActive() && this.isHovered()) {
            this.getOwner().setHoveredItem(null);
        }
        super.setActive(active, silent);
    }

    getMultiSelectClasses(theme: string): string {
        return (
            super.getMultiSelectClasses(theme) +
            ' controls-TileView__checkbox controls-TileView__checkbox_top js-controls-TileView__withoutZoom'
        );
    }
}

Object.assign(TileCollectionItem.prototype, {
    '[Controls/_tileNew/TileCollectionItem]': true,
    _moduleName: 'Controls/tileNew:TileCollectionItem',
    _instancePrefix: 'tile-item-'
});
