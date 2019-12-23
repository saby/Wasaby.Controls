import { TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_listRender/Columns/Columns');

import defaultItemTemplate = require('wml!Controls/_listRender/Columns/resources/ItemTemplateWrapper');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem, Collection } from 'Controls/display';
import { constants } from 'Env/Env';
import {default as BaseRender, IRenderOptions} from './Render';

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

export default class Columns extends BaseRender {
    static _theme: string[] = ['Controls/list_multi'];
    protected _template: TemplateFunction = template;
    protected _children: IRenderChildren;

    protected _templateKeyPrefix: string;
    protected _itemTemplate: TemplateFunction;

    protected _pendingResize: boolean = false;
    protected _onCollectionChange = (_e: unknown, action: string) => {
        if (action !== 'ch') {
            // Notify resize when items are added, removed or replaced, or
            // when the recordset is reset
            this._pendingResize = true;
        }
    }

    protected _beforeMount(options: IRenderOptions): void {
        this._templateKeyPrefix = `columns-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;

        this._subscribeToModelChanges(options.listModel);
    }

    protected _beforeUpdate(newOptions: IRenderOptions): void {
        if (newOptions.listModel !== this._options.listModel) {
            this._subscribeToModelChanges(newOptions.listModel);
        }
    }

    protected _afterRender(): void {
        if (this._pendingResize) {
            this._notify('controlResize', [], { bubbling: true });
            this._pendingResize = false;
        }
    }

    protected _beforeUnmount(): void {
        this._unsubscribeFromModelChanges(this._options.listModel);
    }

    protected _afterMount(): void {
        this._notify('itemsContainerReady', [this.getItemsContainer()]);
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
        e.stopPropagation();
        this._notify('itemSwipe', [item, e]);
    }

    protected _onItemMouseEnter(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
         this._notify('itemMouseEnter', [item, e]);
    }

    protected _onItemMouseMove(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        this._notify('itemMouseMove', [item, e]);
    }

    protected _onItemMouseLeave(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        this._notify('itemMouseLeave', [item, e]);
    }

    protected _onItemWheel(e: SyntheticEvent<WheelEvent>, item: CollectionItem<unknown>): void {
        // Empty handler
    }

    // Обработка клавиатуры будет реализована по работам с маркером в ColumnsView
    protected _onItemKeyDown(e: SyntheticEvent<KeyboardEvent>, item: CollectionItem<unknown>): void {
        e.preventDefault();
        e.stopPropagation();
    }

    // Обработка клавиатуры будет реализована по работам с маркером в ColumnsView
    protected _keyDown(e: SyntheticEvent<KeyboardEvent>): void {
        e.preventDefault();
        e.stopPropagation();
    }

    protected _canHaveMultiselect(options: IRenderOptions): boolean {
        const visibility = options.multiselectVisibility;
        return visibility === 'onhover' || visibility === 'visible';
    }

    protected _subscribeToModelChanges(model: Collection<unknown>): void {
        this._unsubscribeFromModelChanges(this._options.listModel);
        if (model && !model.destroyed) {
            model.subscribe('onCollectionChange', this._onCollectionChange);
        }
    }

    protected _unsubscribeFromModelChanges(model: Collection<unknown>): void {
        if (model && !model.destroyed) {
            this._options.listModel.unsubscribe('onCollectionChange', this._onCollectionChange);
        }
    }
}
