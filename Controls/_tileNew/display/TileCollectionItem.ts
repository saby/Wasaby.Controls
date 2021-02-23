import { CollectionItem, ICollectionItemOptions } from 'Controls/display';
import TileCollection, {DEFAULT_COMPRESSION_COEFF, DEFAULT_SCALE_COEFFICIENT, DEFAULT_TILE_HEIGHT, DEFAULT_TILE_WIDTH, IRoundBorder} from './TileCollection';
import {Model} from 'Types/entity';
import { object } from 'Types/util';
import {getImageClasses, getImageRestrictions, getImageSize, getImageUrl} from '../utils/imageUtil';

const DEFAULT_WIDTH_PROPORTION = 1;

export interface IOptions<S extends Model = Model> extends ICollectionItemOptions<S> {
    tileMode: string;
    tileHeight: number;
    tileWidth: number;
    tileWidthProperty: string;
    roundBorder: IRoundBorder;
    imageProperty: string;
    imageFit: string;
    imageHeightProperty: string;
    imageWidthProperty: string;
    imageUrlResolver: Function;
}

export default class TileCollectionItem<T extends Model = Model> extends CollectionItem<T> {
    protected _$owner: TileCollection<T>;

    protected _$fixedPosition: string;

    protected _$animated: boolean;

    protected _$canShowActions: boolean;

    protected _$tileScalingMode: string;

    // TODO указать нормальный тип
    protected _$tileMode: string;

    protected _$tileHeight: number;

    protected _$tileWidth: number;

    protected _$tileWidthProperty: string;

    protected _$roundBorder: IRoundBorder;

    protected _$imageProperty: string;

    // TODO указать нормальный тип
    protected _$imageFit: string;

    protected _$imageHeightProperty: string;

    protected _$imageWidthProperty: string;

    // TODO указать нормальный тип функции с параметрами
    protected _$imageUrlResolver: Function;

    getTileMode(): string {
        return this._$tileMode;
    }

    getTileHeight(): number {
        return this._$tileHeight || DEFAULT_TILE_HEIGHT;
    }

    getTileWidthProperty(): string {
        return this._$tileWidthProperty;
    }

    getTileScalingMode(): string {
        return this._$tileScalingMode;
    }

    getTileWidth(widthTpl?: number): number {
        const imageHeight = this.getImageHeight();
        const imageWidth = this.getImageWidth();
        const itemWidth = object.getPropertyValue<number>(this.getContents(), this.getTileWidthProperty())
            || this._$tileWidth || widthTpl || DEFAULT_TILE_WIDTH;
        let widthProportion = DEFAULT_WIDTH_PROPORTION;

        let resultWidth = null;
        if (this.getTileMode() === 'dynamic') {
            if (imageHeight && imageWidth) {
                const imageProportion = imageWidth / imageHeight;
                widthProportion = Math.min(DEFAULT_SCALE_COEFFICIENT,
                    Math.max(imageProportion, this.getCompressionCoefficient()));
            }
            // TODO разобраться для чего это свойство нужно, в доке нет, демок нет
            /* else if (this._options.tileFitProperty) {
                return this._itemsHeight * (item.get(this._options.tileFitProperty) || DEFAULT_COMPRESSION_COEFF);
            }*/
        } else {
            return itemWidth;
        }
        resultWidth = Math.floor(this.getTileHeight() * widthProportion);

        return itemWidth ? Math.max(resultWidth, itemWidth) : resultWidth;
    }

    // TODO нужно адекватное название метода
    getDynamicPaddingTop(width?: number): string {
        return `padding-top: ${(this.getTileHeight() / this.getTileWidth(width))} * 100%;`;
    }

    getCompressionCoefficient(): number {
        return DEFAULT_COMPRESSION_COEFF;
    }

    getShadowVisibility(templateShadowVisibility?: string): string {
        return templateShadowVisibility || this._$owner.getShadowVisibility();
    }

    isScaled(): boolean {
        const scalingMode = this.getTileScalingMode();
        return (
            (scalingMode !== 'none' || !!this.getDisplayProperty()) &&
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

    setActive(active: boolean, silent?: boolean): void {
        // TODO This is copied from TileViewModel, but there must be a better
        // place for it. For example, somewhere in ItemAcrions container
        if (!active && this.isActive() && this.isHovered()) {
            this._$owner.setHoveredItem(null);
        }
        super.setActive(active, silent);
    }

    isFixed(): boolean {
        return !!this.getFixedPositionStyle();
    }

    setAnimated(animated: boolean, silent?: boolean): void {
        if (this._$animated === animated) {
            return;
        }
        this._$animated = animated;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('animated');
        }
    }
    setCanShowActions(canShowActions: boolean, silent?: boolean): void {
        if (this._$canShowActions === canShowActions) {
            return;
        }
        this._$canShowActions = canShowActions;
        this._nextVersion();
        if (!silent) {
            this._notifyItemChangeToOwner('canShowActions');
        }
    }
    canShowActions(): boolean {
        return this._$canShowActions;
    }
    isAnimated(): boolean {
        if (this._$animated && !this.isScaled()) {
            // FIXME This is bad, but there is no other obvious place to
            // reset the animation state. Should probably be in that same
            // animation manager
            this.setAnimated(false, true);
            this.setFixedPositionStyle('', true);
            this.setCanShowActions(false);
        }
        return this._$animated;
    }

    isUnscaleable(): boolean {
        return !this.getTileScalingMode() || this.getTileScalingMode() === 'none';
    }

    // region Image

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

    getImageHeight(): number {
        return object.getPropertyValue<number>(this.getContents(), this.getImageHeightProperty());
    }

    getImageWidth(): number {
        return object.getPropertyValue<number>(this.getContents(), this.getImageWidthProperty());
    }

    getImageUrl(widthTpl?: number): string {
        const baseUrl = object.getPropertyValue<string>(this.getContents(), this.getImageProperty());
        if (this.getImageFit() === 'cover') {
            const imageSizes = getImageSize(
                this.getTileWidth(widthTpl),
                this.getTileHeight(),
                this.getTileMode(),
                this.getImageHeight(),
                this.getImageWidth(),
                this.getImageFit()
            );
            return getImageUrl(imageSizes.width, imageSizes.height, baseUrl, this.getContents(), this.getImageUrlResolver());
        } else {
            return baseUrl;
        }
    }

    getImageClasses(widthTpl?: number): string {
        const imageRestrictions = this.getImageFit() === 'cover'
            ? getImageRestrictions(this.getImageHeight(), this.getImageWidth(), this.getTileHeight(), this.getTileWidth(widthTpl))
            : {};
        return getImageClasses(this.getImageFit(), imageRestrictions);
    }

    getImageWrapperClasses(templateHasTitle?: boolean, templateTitleStyle?: string): string {
        const theme = `_theme-${this.getTheme()}`;
        let classes = 'controls-TileView__imageWrapper';
        if (this.isAnimated()) {
            classes += ' controls-TileView__item_animated';
        }
        if ((templateTitleStyle === undefined && templateHasTitle) || templateTitleStyle === 'partial') {
            classes += ` controls-TileView__imageWrapper_reduced${theme}`;
        }

        return classes;
    }

    getImageWrapperStyle(): string {
        let height = this.getTileHeight();
        if (this.isScaled() && this.isAnimated()) {
            height *= this._$owner.getZoomCoefficient();
        }
        return `height: ${height}px;`;
    }

    // endregion Image

    // region Styles

    getInvisibleClasses(): string {
        let classes = `controls-TileView__item controls-TileView__item_theme-${this.getTheme()}`;
        classes += ` ${this.getItemPaddingClasses()} controls-TileView__item_invisible`;
        return classes;
    }

    getInvisibleStyles(templateWidth?: number): string {
        const width = this.getTileWidth(templateWidth);
        return `-ms-flex-preferred-size: ${width}px; flex-basis: ${width}px;`;
    }

    getWrapperClasses(templateClickable?: boolean): string {
        let classes = `controls-TileView__item controls-TileView__item_theme-${this.getTheme()} controls-ListView__itemV`;
        if (templateClickable !== false) {
            classes += ' controls-ListView__itemV_cursor-pointer';
        }

        classes += ` ${this.getItemPaddingClasses()}`;

        // TODO не забыть в Tree добавить {{!!itemData.dragTargetNode ? ' js-controls-TreeView__dragTargetNode'}}`

        return classes;
    }

    getWrapperStyle(templateWidth?: number, staticHeight?: number): string {
        // TODO staticHeight

        const width = this.getTileWidth(templateWidth);
        const compressedWidth = width * this.getCompressionCoefficient();
        return `
            -ms-flex-preferred-size: ${compressedWidth}px;
            flex-basis: ${compressedWidth}px;
            height: ${this.getTileHeight()}px;
            max-width: ${width}px;
        `;
    }

    getContentClasses(
        templateShadowVisibility?: string,
        templateMarker?: boolean,
        highlightOnHover?: boolean,
        backgroundColorStyle?: string
    ): string {
        // TODO недокументированны titleStyle, height, border

        const theme = `_theme-${this.getTheme()}`;

        let classes = `controls-TileView__itemContent controls-TileView__itemContent${theme} js-controls-ListView__measurableContainer`;
        classes += ` ${this.getRoundBorderClasses()}`;

        if (highlightOnHover) {
            classes += ` controls-TileView__itemContent_highlightOnHover${theme}`;
        }

        if (backgroundColorStyle) {
            classes += ` controls-TileView__itemContent_background_${backgroundColorStyle}${theme}`;
        }

        classes += ` controls-ListView__item_shadow_${this.getShadowVisibility(templateShadowVisibility)}${theme}`;
        if (this.isActive()) {
            classes += ` controls-TileView__item_active${theme}`;
        }
        if (this.isHovered()) {
            classes += ' controls-TileView__item_hovered';
        }
        if (this.isSwiped() || !this.isScaled() && !this.isUnscaleable()) {
            classes += ' controls-TileView__item_unfixed';
        }
        if (this.isUnscaleable()) {
            classes += ' controls-TileView__item_unscaleable';
        }
        if (this.isScaled()) {
            classes += ' controls-TileView__item_scaled';
        }
        if (this.isFixed()) {
            classes += ` controls-TileView__item_fixed controls-TileView__item_fixed${theme}`;
        }
        if (this.isAnimated()) {
            classes += ' controls-TileView__item_animated';
        }
        if (this.isDragged()) {
            classes += ` controls-ListView__item_dragging${theme} controls-ListView__itemContent_dragging${theme}`;
        }

        if (this.canShowActions()) {
            classes += ' controls-ListView__item_showActions';
        }
        if (this.isSwiped()) {
            classes += ` controls-TileView__item_swiped${theme}`;
        }
        if (this.shouldDisplayMarker(templateMarker)) {
            classes += ` controls-TileView__item_withMarker controls-TileView__item_withMarker${theme}`;
        } else {
            classes += ` controls-TileView__item_withoutMarker controls-TileView__item_withoutMarker${theme}`;
        }

        return classes;
    }

    // endregion Styles

    // region RoundBorder
    getTopLeftRoundBorder(): string {
        return this._$roundBorder?.tl || 'default';
    }

    getTopRightRoundBorder(): string {
        return this._$roundBorder?.tr || 'default';
    }

    getBottomLeftRoundBorder(): string {
        return this._$roundBorder?.bl || 'default';
    }

    getBottomRightRoundBorder(): string {
        return this._$roundBorder?.br || 'default';
    }

    getRoundBorderClasses(): string {
        const theme = `_theme-${this.getTheme()}`;
        let classes = `controls-TileView__item_roundBorder_topLeft_${this.getTopLeftRoundBorder()}${theme}`;
        classes += ` controls-TileView__item_roundBorder_topRight_${this.getTopRightRoundBorder()}${theme}`;
        classes += ` controls-TileView__item_roundBorder_bottomLeft_${this.getBottomLeftRoundBorder()}${theme}`;
        classes += ` controls-TileView__item_roundBorder_bottomRight_${this.getBottomRightRoundBorder()}${theme}`;
        return classes;
    }
    // endregion RoundBorder

    getTitleClasses(templateHasTitle?: boolean, theme?: string): string {
        let classes = `controls-TileView__title controls-TileView__title_theme-${theme}`;
        if (!templateHasTitle) {
            classes += ' controls-TileView__title_invisible';
        }
        return classes;
    }

    getMultiSelectClasses(theme: string): string {
        return (
            super.getMultiSelectClasses(theme) +
            ' controls-TileView__checkbox controls-TileView__checkbox_top js-controls-TileView__withoutZoom'
        );
    }

    getItemPaddingClasses(): string {
        const theme = `_theme-${this.getTheme()}`;

        let classes = '';
        classes += `controls-TileView__item_spacingLeft_${this.getLeftPadding()}${theme}`;
        classes += ` controls-TileView__item_spacingRight_${this.getRightPadding()}${theme}`;
        classes += ` controls-TileView__item_spacingTop_${this.getTopPadding()}${theme}`;
        classes += ` controls-TileView__item_spacingBottom_${this.getBottomPadding()}${theme}`;

        return classes;
    }
}

Object.assign(TileCollectionItem.prototype, {
    '[Controls/_tileNew/TileCollectionItem]': true,
    _moduleName: 'Controls/tileNew:TileCollectionItem',
    _instancePrefix: 'tile-item-',
    _$fixedPosition: undefined,
    _$animated: false,
    _$canShowActions: false,
    _$tileMode: 'static',
    _$tileHeight: DEFAULT_TILE_HEIGHT,
    _$tileWidth: DEFAULT_TILE_WIDTH,
    _$tileWidthProperty: '',
    _$tileScalingMode: 'none',
    _$imageProperty: '',
    _$imageFit: 'none',
    _$imageHeightProperty: '',
    _$imageWidthProperty: '',
    _$imageUrlResolver: null,
    _$roundBorder: null
});
