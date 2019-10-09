import CollectionItem from './CollectionItem';
import { register } from 'Types/di';
import { TileCollection } from '../display';

export default class TileCollectionItem<T> extends CollectionItem<T> {
    protected _$owner: TileCollection<T>;

    protected _$fixedPosition: string;

    getTileWidth(templateWidth?: number): number {
        return templateWidth || this._$owner.getTileWidth();
    }

    getTileHeight(): number {
        return this._$owner.getTileHeight();
    }

    getCompressionCoefficient(): number {
        return this._$owner.getCompressionCoefficient();
    }

    getShadowVisibility(templateShadowVisibility?: string): string {
        return templateShadowVisibility || this._$owner.getShadowVisibility();
    }

    getImageProperty(): string {
        return this._$owner.getImageProperty();
    }

    isScaled(): boolean {
        const scalingMode = this._$owner.getTileScalingMode();
        return (
            (scalingMode !== 'none' || this.getDisplayProperty()) &&
            (this.isHovered() || this.isActive() || this.isSwiped())
        );
    }

    getFixedPositionStyle(): string {
        return this.isScaled() ? this._$fixedPosition || undefined : undefined;
    }

    setFixedPositionStyle(position: string, silent?: boolean): void {
        if (this._$fixedPosition === position) {
            return;
        }
        this._$fixedPosition = position;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('fixedPosition');
        }
    }

    isFixed(): boolean {
        return !!this.getFixedPositionStyle();
    }

    getTileWrapperStyle(templateWidth?: number): string {
        const width = this.getTileWidth(templateWidth);
        const compressedWidth = width * this.getCompressionCoefficient();
        return `
        -ms-flex-preferred-size: ${compressedWidth}px;
        flex-basis: ${compressedWidth}px;
        height: ${this.getTileHeight()}px;
        max-width: ${width}px;
        `;
    }

    getTileContentClasses(templateShadowVisibility?: string, templateMarker?: boolean): string {
        // {{itemData.isAnimated ? ' controls-TileView__item_animated'}}
        let classes = 'controls-TileView__itemContent js-controls-SwipeControl__actionsContainer';
        classes += ` controls-ListView__item_shadow_${this.getShadowVisibility(templateShadowVisibility)}`;
        if (this.isActive()) {
            classes += ' controls-TileView__item_active';
        }
        if (this.isActive() || this.isHovered()) {
            classes += ' controls-TileView__item_hovered controls-ListView__item_showActions';
        }
        if (this.isScaled()) {
            classes += ' controls-TileView__item_scaled';
        }
        if (this.isFixed()) {
            classes += ' controls-TileView__item_fixed';
        }
        if (this.isSwiped()) {
            classes += ' controls-TileView__item_swiped';
        }
        if (templateMarker !== false && this.isMarked()) {
            classes += ' controls-TileView__item_withMarker';
        } else {
            classes += ' controls-TileView__item_withoutMarker';
        }
        return classes;
    }

    getImageWrapperClasses(templateHasTitle?: boolean): string {
        // {{itemData.isAnimated ? ' controls-TileView__item_animated'}}
        let classes = 'controls-TileView__imageWrapper';
        if (templateHasTitle) {
            classes += ' controls-TileView__imageWrapper_reduced';
        }
        return classes;
    }

    getImageWrapperStyle(): string {
        // {{'height: ' + (itemData.isAnimated && itemData.zoomCoefficient ? itemData.zoomCoefficient * itemData.itemsHeight : itemData.itemsHeight) + 'px;'}}
        const tileHeight = this.getTileHeight();
        const height = this.isScaled() ? this._$owner.getZoomCoefficient() * tileHeight : tileHeight;
        return `height: ${height}px;`;
    }

    getTitleClasses(templateHasTitle?: boolean): string {
        let classes = 'controls-TileView__title';
        if (!templateHasTitle) {
            classes += ' controls-TileView__title_invisible';
        }
        return classes;
    }

    getMultiSelectClasses(): string {
        return (
            super.getMultiSelectClasses() +
            ' controls-TileView__checkbox controls-TileView__checkbox_top js-controls-TileView__withoutZoom'
        );
    }
}

Object.assign(TileCollectionItem.prototype, {
    '[Controls/_display/TileCollectionItem]': true,
    _moduleName: 'Controls/display:TileCollectionItem',
    _instancePrefix: 'tile-item-',
    _$fixedPosition: undefined
});

register('Controls/display:TileCollectionItem', TileCollectionItem, {instantiate: false});
