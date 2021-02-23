import TileCollectionItem, { IOptions } from './TileCollectionItem';
import {Model} from 'Types/entity';
import { Collection, ItemsFactory } from 'Controls/display';
import {object} from "Types/util";

export const DEFAULT_TILE_HEIGHT = 200;
export const DEFAULT_TILE_WIDTH = 250;
export const DEFAULT_COMPRESSION_COEFF = 0.7;
export const DEFAULT_SCALE_COEFFICIENT = 1.5;
const AVAILABLE_CONTAINER_VERTICAL_PADDINGS = ['null', 'default'];
const AVAILABLE_CONTAINER_HORIZONTAL_PADDINGS = ['null', 'default', 'xs', 's', 'm', 'l', 'xl', '2xl'];
const AVAILABLE_ITEM_PADDINGS = ['null', 'default', '3xs', '2xs', 'xs', 's', 'm'];

interface ITileCollectionItemSize {
    width: number;
    height: number;
}

interface ITileCollectionItemPosition {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface IItemPadding {
    left: string;
    right: string;
    bottom: string;
    top: string;
}

export interface IRoundBorder {
    tl: string;
    tr: string;
    bl: string;
    br: string;
}

export default class TileCollection<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> extends Collection<S, T> {
    protected _$tileMode: string;

    protected _$tileHeight: number;

    protected _$tileWidth: number;

    protected _$tileWidthProperty: string;

    protected _$tileScalingMode: string;

    protected _$itemsContainerPadding: IItemPadding;

    protected _$roundBorder: IRoundBorder;

    protected _$imageProperty: string;

    protected _$imageFit: string;

    protected _$imageHeightProperty: string;

    protected _$imageWidthProperty: string;

    // TODO указать нормальный тип функции с параметрами
    protected _$imageUrlResolver: Function;

    protected _hoveredItem: T;

    getTileMode(): string {
        return this._$tileMode;
    }

    getTileHeight(): number {
        return this._$tileHeight;
    }

    getTileWidth(): number {
        return this._$tileWidth;
    }

    getTileWidthProperty(): string {
        return this._$tileWidthProperty;
    }

    getTileScalingMode(): string {
        return this._$tileScalingMode;
    }

    getImageProperty(): string {
        return this._$imageProperty;
    }

    getImageFit(): string {
        return this._$imageFit;
    }

    getImageHeightProperty(): string {
        return this._$imageHeightProperty;
    }

    getImageWidthProperty(): string {
        return this._$imageWidthProperty;
    }

    getImageUrlResolver(): Function {
        return this._$imageUrlResolver;
    }

    getCompressionCoefficient(): number {
        return DEFAULT_COMPRESSION_COEFF;
    }

    getShadowVisibility(): string {
        return 'visible';
    }

    getRoundBorder(): IRoundBorder {
        return this._$roundBorder;
    }

    getZoomCoefficient(): number {
        if (this._$tileScalingMode !== 'none' && this._$tileScalingMode !== 'overlap') {
            return DEFAULT_SCALE_COEFFICIENT;
        }
        return 1;
    }

    getItemContainerSize(itemContainer: HTMLElement): ITileCollectionItemSize {
        const zoomCoefficient = this.getZoomCoefficient();

        const itemContent: HTMLElement = itemContainer.querySelector('.controls-TileView__itemContent');
        const itemContentRect = itemContent.getBoundingClientRect();

        itemContent.classList.add('controls-TileView__item_hovered');
        itemContent.style.width = `${itemContentRect.width * zoomCoefficient}px`;

        let imageWrapper: HTMLElement;
        let imageWrapperRect: ClientRect | DOMRect;
        if (this._$tileMode === 'dynamic') {
            imageWrapper = itemContainer.querySelector('.controls-TileView__imageWrapper');
            imageWrapperRect = imageWrapper.getBoundingClientRect();
            imageWrapper.style.height = `${imageWrapperRect.height * zoomCoefficient}px`;
        }

        const afterZoomRect = itemContent.getBoundingClientRect();

        const result = {
            width: afterZoomRect.width,
            height: afterZoomRect.height
        };

        if (this._$tileMode === 'dynamic') {
            imageWrapper.style.height = `${imageWrapperRect.height}px`;
        }

        itemContent.style.width = '';
        itemContent.classList.remove('controls-TileView__item_hovered');

        return result;
    }

    getItemContainerPosition(
        targetItemSize: ITileCollectionItemSize,
        itemRect: ClientRect | DOMRect,
        viewContainerRect: ClientRect | DOMRect
    ): ITileCollectionItemPosition {
        const additionalWidth = (targetItemSize.width - itemRect.width) / 2;
        const additionalHeightBottom = targetItemSize.height - itemRect.height * this.getZoomCoefficient();
        const additionalHeight = (targetItemSize.height - itemRect.height - additionalHeightBottom) / 2;

        const leftOffset = itemRect.left - viewContainerRect.left - additionalWidth;
        const topOffset = itemRect.top - viewContainerRect.top - additionalHeight;
        const rightOffset = viewContainerRect.right - itemRect.right - additionalWidth;
        const bottomOffset = viewContainerRect.bottom - itemRect.bottom - additionalHeight - additionalHeightBottom;

        return this._createPositionInBounds(leftOffset, topOffset, rightOffset, bottomOffset);
    }

    getItemContainerStartPosition(
        itemRect: ClientRect | DOMRect,
        documentRect: ClientRect | DOMRect
    ): ITileCollectionItemPosition {
        return {
            top: itemRect.top,
            left: itemRect.left,
            right: documentRect.width - itemRect.right,
            bottom: documentRect.height - itemRect.bottom
        };
    }

    getItemContainerPositionInDocument(
        targetItemPosition: ITileCollectionItemPosition,
        viewContainerRect: ClientRect | DOMRect,
        documentRect: ClientRect | DOMRect
    ): ITileCollectionItemPosition {
        const left = targetItemPosition.left + viewContainerRect.left;
        const top = targetItemPosition.top + viewContainerRect.top;
        const right = targetItemPosition.right + documentRect.width - viewContainerRect.right;
        const bottom = targetItemPosition.bottom + documentRect.height - viewContainerRect.bottom;

        return this._createPositionInBounds(left, top, right, bottom);
    }

    getItemsContainerTopPadding(): string {
        if (!AVAILABLE_CONTAINER_VERTICAL_PADDINGS.includes(this._$itemsContainerPadding?.top)) {
            return 'default';
        }
        return this._$itemsContainerPadding?.top;
    }

    getItemsContainerBottomPadding(): string {
        if (!AVAILABLE_CONTAINER_VERTICAL_PADDINGS.includes(this._$itemsContainerPadding?.bottom)) {
            return 'default';
        }
        return this._$itemsContainerPadding?.bottom;
    }

    getItemsContainerLeftPadding(): string {
        if (!AVAILABLE_CONTAINER_HORIZONTAL_PADDINGS.includes(this._$itemsContainerPadding?.left)) {
            return 'default';
        }
        return this._$itemsContainerPadding?.left;
    }

    getItemsContainerRightPadding(): string {
        if (!AVAILABLE_CONTAINER_HORIZONTAL_PADDINGS.includes(this._$itemsContainerPadding?.right)) {
            return 'default';
        }
        return this._$itemsContainerPadding?.right;
    }

    getItemsPaddingContainerClasses(): string {
        const theme = `_theme-${this.getTheme()}`;
        let classes = '';
        if (this._$itemsContainerPadding) {
            classes += `controls-TileView__itemsPaddingContainer_spacingLeft_${this.getItemsContainerLeftPadding()}_itemPadding_${this.getLeftPadding()}${theme}`;
            classes += ` controls-TileView__itemsPaddingContainer_spacingRight_${this.getItemsContainerRightPadding()}_itemPadding_${this.getRightPadding()}${theme}`;
            classes += ` controls-TileView__itemsPaddingContainer_spacingTop_${this.getItemsContainerTopPadding()}_itemPadding_${this.getTopPadding()}${theme}`;
            classes += ` controls-TileView__itemsPaddingContainer_spacingBottom_${this.getItemsContainerBottomPadding()}_itemPadding_${this.getBottomPadding()}${theme}`;
        } else {
            classes += `controls-TileView__itemsPaddingContainer_spacingLeft_${this.getLeftPadding()}${theme}`;
            classes += ` controls-TileView__itemsPaddingContainer_spacingRight_${this.getRightPadding()}${theme}`;
            classes += ` controls-TileView__itemsPaddingContainer_spacingTop_${this.getTopPadding()}${theme}`;
            classes += ` controls-TileView__itemsPaddingContainer_spacingBottom_${this.getBottomPadding()}${theme}`;
        }
        return classes;
    }

    protected _createPositionInBounds(
        left: number,
        top: number,
        right: number,
        bottom: number
    ): ITileCollectionItemPosition {
        if (left < 0) {
            right += left;
            left = 0;
        } else if (right < 0) {
            left += right;
            right = 0;
        }
        if (top < 0) {
            bottom += top;
            top = 0;
        } else if (bottom < 0) {
            top += bottom;
            bottom = 0;
        }

        if (left < 0 || right < 0 || top < 0 || bottom < 0) {
            return null;
        } else {
            return { left, top, right, bottom };
        }
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TileItemsFactory(options: IOptions<S>): T {
            this._fillItemsFactoryOptions(options);
            return parent.call(this, options);
        };
    }

    protected _fillItemsFactoryOptions(options: IOptions<S>): void {
        options.tileMode = this.getTileMode();
        options.tileHeight = this.getTileHeight();
        options.tileWidth = this.getTileWidth();
        options.tileWidthProperty = this.getTileWidthProperty();
        options.roundBorder = this.getRoundBorder();
        options.imageProperty = this.getImageProperty();
        options.imageFit = this.getImageFit();
        options.imageHeightProperty = this.getImageHeightProperty();
        options.imageWidthProperty = this.getImageWidthProperty();
        options.imageUrlResolver = this.getImageUrlResolver();
    }
}

Object.assign(TileCollection.prototype, {
    '[Controls/_tileNew/TileCollection]': true,
    _moduleName: 'Controls/tileNew:TileCollection',
    _instancePrefix: 'tile-item-',
    _itemModule: 'Controls/tileNew:TileCollectionItem',
    _$tileMode: 'static',
    _$tileHeight: DEFAULT_TILE_HEIGHT,
    _$tileWidth: DEFAULT_TILE_WIDTH,
    _$imageProperty: '',
    _$imageFit: 'none',
    _$imageHeightProperty: '',
    _$imageWidthProperty: '',
    _$imageUrlResolver: null,
    _$tileScalingMode: 'none',
    _$tileWidthProperty: '',
    _$itemsContainerPadding: null,
    _$roundBorder: null,
    _hoveredItem: null
});
