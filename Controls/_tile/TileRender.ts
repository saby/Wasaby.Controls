import { TemplateFunction } from 'UI/Base';

// FIXME FIXME FIXME
// Import from the library, but think about how it can be loaded
// only when actually used
import BaseRender, { IRenderOptions } from 'Controls/_list/Render';

import template = require('wml!Controls/_tile/TileRender/TileRender');
import defaultItemTemplate = require('wml!Controls/_tile/TileRender/resources/ItemTemplate');

import { TileCollection, TileCollectionItem } from 'Controls/display';
import { SyntheticEvent } from 'Vdom/Vdom';

export interface ITileRenderOptions extends IRenderOptions {
    listModel: TileCollection<unknown>;
    tileScalingMode?: string;
}

export default class TileRender extends BaseRender {
    protected _options: ITileRenderOptions;
    protected _template: TemplateFunction = template;

    protected _beforeMount(options: ITileRenderOptions): void {
        this._templateKeyPrefix = `tile-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;
    }

    protected _afterMount(options: ITileRenderOptions): void {
        super._afterMount(options);
        this._notify('register', ['controlResize', this, this._resetHoverState], { bubbling: true });
        this._notify('register', ['scroll', this, this._resetHoverState], { bubbling: true });
    }

    protected _resetHoverState(): void {
        this._options.listModel.setHoveredItem(null);
    }

    protected _onItemWheel(): void {
        this._resetHoverState();
    }

    protected _onItemMouseMove(e: SyntheticEvent<MouseEvent>, item: TileCollectionItem<unknown>): void {
        if (!item.isFixed() /* TODO && !_private.isTouch(this) && !this._listModel.getDragEntity() */) {
            // TODO Inefficient, gets called multiple times per hover. Maybe some other
            // event should be used, not mousemove
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
        const viewContainer = this._options.tileScalingMode === 'inside' ? this.getItemsContainer() : document.documentElement;
        const viewContainerRect = viewContainer.getBoundingClientRect();
        const targetItemSize = this._options.listModel.getItemContainerSize(itemContainer);
        const targetItemPosition = this._options.listModel.getItemContainerPosition(targetItemSize, itemContainerRect, viewContainerRect);
        const targetItemPositionInDocument = this._options.listModel.getItemContainerPositionInDocument(targetItemPosition, viewContainerRect, document.documentElement.getBoundingClientRect());

        // TODO This should be done through the model/manager
        item.setFixedPositionStyle(this._convertPositionToStyle(targetItemPositionInDocument));
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
