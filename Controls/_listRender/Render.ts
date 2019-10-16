import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_listRender/Render/Render');

import defaultItemTemplate = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');

import { SyntheticEvent } from 'Vdom/Vdom';
import { debounce } from 'Types/function';
import { CollectionItem, Collection } from 'Controls/display';

export interface IRenderOptions extends IControlOptions {
    listModel: Collection<unknown>;
    contextMenuEnabled?: boolean;
    contextMenuVisibility?: boolean;
    multiselectVisibility?: string;
    itemTemplate?: TemplateFunction;
}

export interface IRenderChildren {
    itemsContainer?: HTMLDivElement;
}

const HOVERED_ITEM_CHANGE_DELAY = 150;

export default class Render extends Control<IRenderOptions> {
    protected _template: TemplateFunction = template;
    protected _children: IRenderChildren;

    protected _templateKeyPrefix: string;
    protected _itemTemplate: TemplateFunction;

    private _debouncedSetHoveredItem: typeof Render.prototype._setHoveredItem;

    protected _beforeMount(options: IRenderOptions): void {
        this._templateKeyPrefix = `list-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;

        this._debouncedSetHoveredItem = debounce(
            this._setHoveredItem.bind(this),
            HOVERED_ITEM_CHANGE_DELAY
        ) as typeof Render.prototype._setHoveredItem;
    }

    getItemsContainer(): HTMLDivElement {
        return this._children.itemsContainer;
    }

    protected _onItemClick(
        e: SyntheticEvent<MouseEvent> & { preventItemEvent?: boolean },
        item: CollectionItem<unknown>
    ): void {
        if (!e.preventItemEvent && !item.isEditing()) {
            this._notify('itemClick', [item.getContents(), e], { bubbling: true });
        }
    }

    protected _onItemContextMenu(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        if (
            this._options.contextMenuEnabled !== false &&
            this._options.contextMenuVisibility !== false &&
            !this._options.listModel.isEditing()
        ) {
            this._notify('itemContextMenu', [item, e, false]);
        }
    }

    protected _onItemSwipe(e: SyntheticEvent<null>, item: CollectionItem<unknown>): void {
        this._notify('itemSwipe', [item, e]);
        e.stopPropagation();
    }

    protected _onItemMouseEnter(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        // this._notify('itemMouseEnter', [item, e]);
        this._debouncedSetHoveredItem(item);
    }

    protected _onItemMouseMove(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        // this._notify('itemMouseLeave', [item, e]);
    }

    protected _onItemMouseLeave(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        // this._notify('itemMouseMove', [item, e]);
        this._debouncedSetHoveredItem(null);
    }

    protected _onItemWheel(e: SyntheticEvent<WheelEvent>, item: CollectionItem<unknown>): void {
        // Empty handler
    }

    protected _canHaveMultiselect(options: IRenderOptions): boolean {
        const visibility = options.multiselectVisibility;
        return visibility === 'onhover' || visibility === 'visible';
    }

    private _setHoveredItem(item: CollectionItem<unknown>): void {
        this._options.listModel.setHoveredItem(item);
    }
}
