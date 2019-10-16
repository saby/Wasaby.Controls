import { TemplateFunction } from 'UI/Base';

import { Render as BaseRender, IRenderOptions } from 'Controls/listRender';

import template = require('wml!Controls/_tile/TileRender/TileRender');
import defaultItemTemplate = require('wml!Controls/_tile/TileRender/resources/ItemTemplateWrapper');

import { TileCollection, TileCollectionItem } from 'Controls/display';
import { SyntheticEvent } from 'Vdom/Vdom';

export interface ITileRenderOptions extends IRenderOptions {
    listModel: TileCollection<unknown>;
    tileScalingMode?: string;
}

export default class TileRender extends BaseRender {
    protected _options: ITileRenderOptions;
    protected _template: TemplateFunction = template;

    protected _animatedItem: TileCollectionItem<unknown> = null;
    protected _animatedItemTargetPosition: string;

    protected _beforeMount(options: ITileRenderOptions): void {
        super._beforeMount(options);
        this._templateKeyPrefix = `tile-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;
    }

    protected _afterMount(options: ITileRenderOptions): void {
        super._afterMount(options);
        this._notify('register', ['controlResize', this, this._resetHoverState], { bubbling: true });
        this._notify('register', ['scroll', this, this._resetHoverState], { bubbling: true });
    }

    protected _afterUpdate(): void {
        super._afterUpdate();
        if (this._animatedItem) {
            // TODO This should probably be moved to some kind of animation manager
            if (this._animatedItem.isFixed() && !this._animatedItem.isAnimated()) {
                this._animatedItem.setAnimated(true);
                this._animatedItem.setFixedPositionStyle(this._animatedItemTargetPosition);
                this._animatedItem = null;
            }
        }
    }

    protected _beforeUnmount(): void {
        this._animatedItem = null;

        this._notify('unregister', ['controlResize', this], { bubbling: true });
        this._notify('unregister', ['scroll', this], { bubbling: true });

        super._beforeUnmount();
    }

    protected _resetHoverState(): void {
        this._options.listModel.setHoveredItem(null);
    }

    protected _onItemWheel(): void {
        this._resetHoverState();
    }

    protected _onItemMouseMove(e: SyntheticEvent<MouseEvent>, item: TileCollectionItem<unknown>): void {
        if (!item.isFixed() /* TODO && !_private.isTouch(this) && !this._listModel.getDragEntity() */) {
            // TODO Might be inefficient, can get called multiple times per hover. Should
            // be called immediately before or after the hovered item is set in the model,
            // but then we can't get the hover target element.
            // Doesn't look too bad in the demo profile, so leaving it as is for now.
            this._setHoveredItemPosition(e, item);
        }
        super._onItemMouseMove(e, item);
    }

    protected _setHoveredItemPosition(e: SyntheticEvent<MouseEvent>, item: TileCollectionItem<unknown>): void {
        const target = e.target as HTMLElement;

        if (this._options.tileScalingMode === 'none' || target.closest('.js-controls-TileView__withoutZoom')) {
            return;
        }

        const itemContainer: HTMLElement = target.closest('.controls-TileView__item');
        const itemContainerRect = itemContainer.getBoundingClientRect();

        const viewContainer = this._options.tileScalingMode === 'inside'
            ? this.getItemsContainer()
            : document.documentElement;
        const viewContainerRect = viewContainer.getBoundingClientRect();

        const targetItemSize = this._options.listModel.getItemContainerSize(itemContainer);
        const targetItemPosition = this._options.listModel.getItemContainerPosition(
            targetItemSize,
            itemContainerRect,
            viewContainerRect
        );

        const documentRect = document.documentElement.getBoundingClientRect();
        const targetItemPositionInDocument = this._options.listModel.getItemContainerPositionInDocument(
            targetItemPosition,
            viewContainerRect,
            documentRect
        );

        // TODO This should probably be moved to some kind of animation manager
        if (targetItemPositionInDocument) {
            const targetPositionStyle = this._convertPositionToStyle(targetItemPositionInDocument);
            if (this._options.tileScalingMode !== 'overlap') {
                const startItemPositionInDocument = this._options.listModel.getItemContainerStartPosition(
                    itemContainerRect,
                    documentRect
                );
                item.setFixedPositionStyle(this._convertPositionToStyle(startItemPositionInDocument));
                this._animatedItem = item;
                this._animatedItemTargetPosition = targetPositionStyle;
            } else {
                item.setFixedPositionStyle(targetPositionStyle);
            }
        }
    }

    protected _convertPositionToStyle(position): string {
        let result = '';
        for (const key in position) {
            if (position.hasOwnProperty(key)) {
                result += `${key}: ${position[key]}px;`;
            }
        }
        return result;
    }
}
