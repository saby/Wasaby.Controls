import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import template = require('wml!Controls/_listRender/View/View');

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { create as diCreate } from 'Types/di';

import { Collection, CollectionItem, ItemActionsController } from 'Controls/display';
import tmplNotify = require('Controls/Utils/tmplNotify');

import { load as libraryLoad } from 'Core/library';
import { SyntheticEvent } from 'Vdom/Vdom';

export interface IViewOptions extends IControlOptions {
    items: RecordSet;

    collection: string;
    render: string;

    itemActions?: any[];
    itemActionVisibilityCallback?: Function;
    itemActionsPosition?: string;
}

interface ISwipeEvent extends Event {
    direction: string;
}

export default class View extends Control<IViewOptions> {
    protected _template: TemplateFunction = template;
    protected _tmplNotify: Function = tmplNotify;

    protected _collection: Collection<Model>;

    protected _isHovered: boolean = false;

    protected async _beforeMount(options: IViewOptions): Promise<void> {
        this._collection = this._createCollection(options.collection, options.items, options);
        return libraryLoad(options.render).then(() => null);
    }

    protected _beforeUpdate(options: IViewOptions): void {
        if (options.items !== this._options.items) {
            if (this._collection) {
                this._collection.destroy();
            }
            this._collection = this._createCollection(options.collection, options.items, options);
        }
        if (
            options.itemActions !== this._options.itemActions ||
            options.itemActionVisibilityCallback !== this._options.itemActionVisibilityCallback
        ) {
            ItemActionsController.resetActionsAssignment(this._collection);
            if (this._isHovered) {
                ItemActionsController.assignActions(
                    this._collection,
                    options.itemActions,
                    options.itemActionVisibilityCallback
                );
            }
        }
    }

    protected _beforeUnmount(): void {
        if (this._collection) {
            this._collection.destroy();
            this._collection = null;
        }
    }

    protected _onRenderMouseEnter(e: SyntheticEvent<MouseEvent>): void {
        this._isHovered = true;
        ItemActionsController.assignActions(
            this._collection,
            this._options.itemActions,
            this._options.itemActionVisibilityCallback
        );
    }

    protected _onRenderMouseLeave(e: SyntheticEvent<MouseEvent>): void {
        this._isHovered = false;
    }

    protected _onRenderTouchStart(e: SyntheticEvent<TouchEvent>): void {
        this._isHovered = true;
        ItemActionsController.assignActions(
            this._collection,
            this._options.itemActions,
            this._options.itemActionVisibilityCallback
        );
    }

    protected _onRenderTouchEnd(e: SyntheticEvent<TouchEvent>): void {
        this._isHovered = false;
    }

    protected _onItemClick(
        e: SyntheticEvent<null>,
        item: Model,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {

    }

    protected _onItemSwipe(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        swipeEvent: SyntheticEvent<ISwipeEvent>
    ): void {

    }

    protected _onItemActionClick(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        action: unknown,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        ItemActionsController.processActionClick(
            this._collection,
            item.getContents().getKey(),
            action,
            clickEvent,
            false
        );
        // NB How to fire 'actionClick' event???
    }

    protected _onItemContextMenu(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        ItemActionsController.prepareActionsMenuConfig(
            this._collection,
            item.getContents().getKey(),
            clickEvent,
            null,
            true
        );
    }

    private _createCollection(
        module: string,
        items: RecordSet,
        collectionOptions: IViewOptions
    ): Collection<Model> {
        return diCreate(module, { ...collectionOptions, collection: items });
    }

    static getDefaultOptions(): Partial<IViewOptions> {
        return {
            itemActionsPosition: 'inside'
        };
    }
}
