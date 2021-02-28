import {ListView} from 'Controls/list';
import template = require('wml!Controls/_tileNew/render/TileView');
import defaultItemTpl = require('wml!Controls/_tileNew/render/items/Default');
import {TouchContextField} from 'Controls/context';
import { TILE_SCALING_MODE, ZOOM_COEFFICIENT, ZOOM_DELAY } from './utils/Constants';
import {isEqual} from 'Types/object';
import { getItemSize } from './utils/imageUtil';
import { TemplateFunction } from 'UI/Base';
import TileCollectionItem from './display/TileCollectionItem';
import TileCollection from './display/TileCollection';
import {SyntheticEvent} from 'UI/Vdom';
import {Model} from 'Types/entity';

export default class TileView extends ListView {
    protected _template: TemplateFunction = template;
    protected _defaultItemTemplate: TemplateFunction = defaultItemTpl;
    protected _hoveredItem: TileCollectionItem;
    protected _mouseMoveTimeout: number;
    protected _listModel: TileCollection;

    _afterMount(options: any): void {
        this._notify('register', ['controlResize', this, this._onResize], {bubbling: true});
        this._notify('register', ['scroll', this, this._onScroll, {listenAll: true}], {bubbling: true});
        super._afterMount(options);
    }

    _onResize(): void {
        this._listModel.setHoveredItem(null);
    }

    _beforeUpdate(newOptions: any): void {
        if (this._options.tileMode !== newOptions.tileMode) {
            this._listModel.setTileMode(newOptions.tileMode);
        }
        if (this._options.itemsContainerPadding !== newOptions.itemsContainerPadding) {
            this._listModel.setItemsContainerPadding(newOptions.itemsContainerPadding);
        }
        if (this._options.tileHeight !== newOptions.tileHeight) {
            this._listModel.setTileHeight(newOptions.tileHeight);
        }
        if (!isEqual(this._options.roundBorder, newOptions.roundBorder)) {
            this._listModel.setRoundBorder(newOptions.roundBorder);
        }
        super._beforeUpdate(newOptions);
    }

    _afterUpdate(options: any): void {
        const hoveredItem = this._listModel.getHoveredItem();

        if (
            hoveredItem &&
            hoveredItem.endPosition &&
            hoveredItem.endPosition !== hoveredItem.position &&
            this._hasFixedItemInDOM()
        ) {

            // TODO: KINGO
            // Браузер устанавливает на элемент position: fixed, а изменение свойств top/left/bottom/right группирует в
            // одну перерисовку. В итоге, первые стили не проставляются, получаем большой контейнер.
            // Когда устанавливаются вторые стили, контейнер сжимается до нужных размеров.
            // Такое поведение стало проявляться, видимо, после оптимизации и ускорения шаблонизатора.
            // Перерисовки, которые раньше происходили в два кадра, теперь происходят в один.
            // Поэтому нужно вызвать forced reflow, чтобы применились первые стили, перед применением вторых.

            const container = this._container[0] || this._container;
            container.getBoundingClientRect();

            this._listModel.setHoveredItem({
                key: hoveredItem.key,
                isAnimated: true,
                canShowActions: true,
                zoomCoefficient: this._getZoomCoefficient(),
                position: hoveredItem.endPosition
            });
        }
        super._afterUpdate(options);
    }

    _beforeUnmount(): void {
        this._notify('unregister', ['controlResize', this], {bubbling: true});
        this._notify('unregister', ['scroll', this, {listenAll: true}], {bubbling: true});
    }

    getActionsMenuConfig(
        item: Model,
        clickEvent: SyntheticEvent,
        action: object,
        isContextMenu: boolean,
        menuConfig: object,
        itemData: TileCollectionItem
    ): Record<string, any> {
        const isActionMenu = !!action && !action.isMenu;
        if (this._shouldOpenExtendedMenu(isActionMenu, isContextMenu, itemData) && menuConfig) {
            const MENU_MAX_WIDTH = 200;
            const menuOptions = menuConfig.templateOptions;
            const itemContainer = clickEvent.target.closest('.controls-TileView__item');
            const imageWrapper = itemContainer.querySelector('.controls-TileView__imageWrapper');
            if (!imageWrapper) {
                return null;
            }
            let previewWidth = imageWrapper.clientWidth;
            let previewHeight = imageWrapper.clientHeight;
            menuOptions.image = itemData.getImageUrl();
            menuOptions.title = itemData.getDisplayValue();
            menuOptions.additionalText = itemData.item.get(menuOptions.headerAdditionalTextProperty);
            menuOptions.imageClasses = itemData.getImageClasses();
            if (this._options.tileScalingMode === TILE_SCALING_MODE.NONE) {
                previewHeight = previewHeight * ZOOM_COEFFICIENT;
                previewWidth = previewWidth * ZOOM_COEFFICIENT;
            }
            menuOptions.previewHeight = previewHeight;
            menuOptions.previewWidth = previewWidth;

            return {
                templateOptions: menuOptions,
                closeOnOutsideClick: true,
                maxWidth: menuOptions.previewWidth + MENU_MAX_WIDTH,
                target: imageWrapper,
                className: 'controls-TileView__itemActions_menu_popup',
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'left'
                },
                opener: menuConfig.opener,
                template: 'Controls/tile:ActionsMenu',
                actionOnScroll: 'close'
            };
        } else {
            return null;
        }
    }

    _shouldOpenExtendedMenu(isActionMenu: boolean, isContextMenu: boolean, item: TileCollectionItem): boolean {
        const isScalingTile = this._options.tileScalingMode !== 'none' &&
            this._options.tileScalingMode !== 'overlap';
        return this._options.actionMenuViewMode === 'preview' && !isActionMenu && !(isScalingTile && isContextMenu);
    }

    // TODO: Удалить проверку на DOM. https://online.sbis.ru/opendoc.html?guid=85bf65db-66a4-4b17-a59d-010a5ecb15a9
    _hasFixedItemInDOM(): boolean {
        return !!this._children.tileContainer.querySelector('.controls-TileView__item_fixed');
    }

    _onItemMouseLeave(event: SyntheticEvent, itemData: TileCollectionItem): void {
        const hoveredItem = this._listModel.getHoveredItem();
        if (hoveredItem && hoveredItem.key === itemData.key) {
            if (!itemData.isActive() || hoveredItem.key !== itemData.key) {
                this._listModel.setHoveredItem(null);
            }
        }
        this._clearMouseMoveTimeout();
        super._onItemMouseLeave(event, itemData);
    }

    _onItemMouseMove(event: SyntheticEvent, itemData: TileCollectionItem): void {
        const hoveredItem = this._listModel.getHoveredItem();
        const isCurrentItemHovered = hoveredItem && hoveredItem.key === itemData.key;
        const activeItem = this._listModel.getActiveItem();
        if (!isCurrentItemHovered &&
            this._shouldProcessHover() &&
            !this._listModel.isDragging() &&
            !activeItem
        ) {
            if (this._options.tileScalingMode !== TILE_SCALING_MODE.NONE) {
                this._clearMouseMoveTimeout();
                this._calculateHoveredItemPosition(event, itemData);
            } else {
                const itemWidth = event.target.closest('.controls-TileView__item').clientWidth;
                this._setHoveredItem(itemData, null, null, true, itemWidth);
            }
        }

        super._onItemMouseMove(event, itemData);
    }

    _calculateHoveredItemPosition(event: SyntheticEvent, itemData: TileCollectionItem, documentForUnits?: boolean): void {
        const documentObject = documentForUnits ? documentForUnits : document;
        const itemContainer = event.target.closest('.controls-TileView__item');
        const itemContainerRect = itemContainer.getBoundingClientRect();
        const container = this._options.tileScalingMode === TILE_SCALING_MODE.INSIDE ? this._children.tileContainer : documentObject.documentElement;
        const containerRect = container.getBoundingClientRect();
        let itemSize;

        // If the hover on the checkbox does not increase the element
        if (event.target.closest('.js-controls-TileView__withoutZoom')) {
            if (documentForUnits) {
                itemSize = itemContainerRect;
            } else {
                itemSize = getItemSize(itemContainer, 1, this._options.tileMode);
            }
            let position = this._getPositionInContainer(itemSize, itemContainerRect, containerRect, 1, true);
            const documentRect = documentObject.documentElement.getBoundingClientRect();
            position = this._getPositionInDocument(position, containerRect, documentRect, true);
            this._setHoveredItem(itemData, position, position, true, itemSize.width);
        } else {
            itemSize = getItemSize(itemContainer, this._getZoomCoefficient(), this._options.tileMode);
            this._prepareHoveredItem(itemData, itemContainerRect, itemSize, containerRect);
        }
    }

    _prepareHoveredItem(itemData: TileCollectionItem, itemContainerRect, itemSize, containerRect): void {
        let
            documentRect,
            itemStartPosition,
            position = this._getPositionInContainer(itemSize, itemContainerRect, containerRect, this._getZoomCoefficient());

        if (position) {
            documentRect = document.documentElement.getBoundingClientRect();
            if (this._options.tileScalingMode !== TILE_SCALING_MODE.NONE && this._options.tileScalingMode !== TILE_SCALING_MODE.OVERLAP) {
                itemStartPosition = this._getItemStartPosition(itemContainerRect, documentRect);
            } else {
                itemStartPosition = null;
            }
            this._mouseMoveTimeout = setTimeout(function() {
                this._setHoveredItem(itemData, this._getPositionInDocument(position, containerRect, documentRect), itemStartPosition, null, itemSize.width);
            }, ZOOM_DELAY);
        } else {
            /* Если позиции нет, то это означает, что плитка по одной из координат выходит за пределы контейнера.
               В таком случае ее не надо увеличивать и itemAction'ы нужно посчитать от оригинального размера.
             */
            this._setHoveredItem(itemData, null, null, false, itemContainerRect.width);
        }
    }

    _getZoomCoefficient(): number {
        return this._options.tileScalingMode !== TILE_SCALING_MODE.NONE && this._options.tileScalingMode !== TILE_SCALING_MODE.OVERLAP
            ? ZOOM_COEFFICIENT
            : 1;
    }

    _setHoveredItem(itemData: TileCollectionItem, position: string, startPosition: string, noZoom: boolean, itemWidth?: number): void {
        const needUpdateActions = this._options.actionMode === 'adaptive' && (!itemData.isNode || !itemData.isNode());
        if (this._options.tileScalingMode !== TILE_SCALING_MODE.NONE) {
            this._listModel.setHoveredItem({
                key: itemData.key,
                canShowActions: noZoom || !position || this._options.tileScalingMode === TILE_SCALING_MODE.OVERLAP,
                zoomCoefficient: this._getZoomCoefficient(),
                position: this._getPositionStyle(startPosition || position),
                endPosition: this._getPositionStyle(position)
            });
        }
        if (needUpdateActions) {
            this._notify('updateItemActionsOnItem', [itemData.key, itemWidth], {bubbling: true});
        }
    }

    getItemsPaddingContainerClasses(): string {
        const theme = `_theme-${this._options.theme}`;
        let classes = 'controls-TileView__itemPaddingContainer ';

        if (this._listModel.getCount()) {
            if (this._options.itemsContainerPadding) {
                classes += `controls-TileView__itemsPaddingContainer_spacingLeft_${this._options.itemsContainerPadding?.left || 'default'}_itemPadding_${this._options.leftPadding || 'default'}${theme}`;
                classes += ` controls-TileView__itemsPaddingContainer_spacingRight_${this._options.itemsContainerPadding?.right || 'default'}_itemPadding_${this._options.rightPadding || 'default'}${theme}`;
                classes += ` controls-TileView__itemsPaddingContainer_spacingTop_${this._options.itemsContainerPadding?.top || 'default'}_itemPadding_${this._options.topPadding || 'default'}${theme}`;
                classes += ` controls-TileView__itemsPaddingContainer_spacingBottom_${this._options.itemsContainerPadding?.bottom || 'default'}_itemPadding_${this._options.bottomPadding || 'default'}${theme}`;
            } else {
                classes += `controls-TileView__itemsPaddingContainer_spacingLeft_${this._options.leftPadding || 'default'}${theme}`;
                classes += ` controls-TileView__itemsPaddingContainer_spacingRight_${this._options.rightPadding || 'default'}${theme}`;
                classes += ` controls-TileView__itemsPaddingContainer_spacingTop_${this._options.topPadding || 'default'}${theme}`;
                classes += ` controls-TileView__itemsPaddingContainer_spacingBottom_${this._options.bottomPadding || 'default'}${theme}`;
            }
        }

        return classes;
    }

    _onItemWheel(): void {
        this.onScroll();
    }

    _onScroll(): void {
        this.onScroll();
    }

    getItemsContainer(): object {
        return this._children.tileContainer;
    }

    _onTileViewKeyDown(): void {}

    private _getPositionInContainer(itemNewSize: object, itemRect: object, containerRect: object, zoomCoefficient: number, withoutCorrection: boolean = false): object {
        const
            additionalWidth = (itemNewSize.width - itemRect.width) / 2,
            additionalHeightBottom = (itemNewSize.height - itemRect.height * zoomCoefficient),
            additionalHeight = (itemNewSize.height - itemRect.height - additionalHeightBottom) / 2,
            left = itemRect.left - (containerRect.left + additionalWidth),
            top = itemRect.top - (containerRect.top + additionalHeight),
            right = containerRect.right - (itemRect.right + additionalWidth),
            bottom = containerRect.bottom - (itemRect.bottom + additionalHeight + additionalHeightBottom);

        return withoutCorrection ? {left, right, top, bottom} : this.getCorrectPosition(top, right, bottom, left);
    }

    private _getPositionInDocument(position: object, containerRect: object, documentRect: object, withoutCorrection: boolean = false): object {
        const
            left = position.left + containerRect.left,
            right = position.right + (documentRect.width - containerRect.right),
            top = position.top + containerRect.top,
            bottom = position.bottom + (documentRect.height - containerRect.bottom);

        return withoutCorrection ? {left, right, top, bottom} : this.getCorrectPosition(top, right, bottom, left);
    }

    private getCorrectPosition(top: number, right: number, bottom: number, left: number): object {
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
            return {left, right, top, bottom};
        }
    }

    private _getItemStartPosition(itemContainerRect: object, containerRect: object): object {
        return {
            top: itemContainerRect.top,
            left: itemContainerRect.left,
            right: containerRect.width - itemContainerRect.right,
            bottom: containerRect.height - itemContainerRect.bottom
        };
    }

    private onScroll(): void {
        this._clearMouseMoveTimeout(this);
        this._listModel.setHoveredItem(null);
    }
    private _clearMouseMoveTimeout(): void {
        clearTimeout(this._mouseMoveTimeout);
        this._mouseMoveTimeout = null;
    }

    private _getPositionStyle(position: object): string {
        let result = '';
        if (position) {
            for (const side in position) {
                if (position.hasOwnProperty(side)) {
                    result += side + ': ' + position[side] + 'px; ';
                }
            }
        }
        return result;
    }

    // TODO Нужен синглтон, который говорит, идет ли сейчас перетаскивание
    // https://online.sbis.ru/opendoc.html?guid=a838cfd3-a49b-43a8-821a-838c1344288b
    private _shouldProcessHover(): boolean {
        return (
            !this._context?.isTouch?.isTouch &&
            !document.body.classList.contains('ws-is-drag')
        );
    }

    static _theme: string[] = ['Controls/tile'];

    static getDefaultOptions(): object {
        return {
            itemsHeight: 150,
            tileMode: 'static',
            tileScalingMode: TILE_SCALING_MODE.NONE
        };
    }

    static contextTypes(): object {
        return {
            isTouch: TouchContextField
        };
    }
}

Object.defineProperty(TileView, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return TileView.getDefaultOptions();
   }
});
