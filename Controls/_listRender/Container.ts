import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import template = require('wml!Controls/_listRender/Container/Container');

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { create as diCreate } from 'Types/di';

import { Collection } from 'Controls/display';

import { load as libraryLoad } from 'Core/library';

export type TCollectionKind = 'list'|'tile';
export type TItemActionVisibilityCallback = (action, item: Model) => boolean;

export interface IContainerOptions extends IControlOptions {
    items: RecordSet;
    kind: TCollectionKind;

    itemActions?: any[];
    itemActionsVisibilityCallback?: TItemActionVisibilityCallback;
}

export default class Container extends Control<IContainerOptions> {
    protected _template: TemplateFunction = template;

    private _collection: Collection<Model>;
    private _render: string;

    protected async _beforeMount(options: IContainerOptions): Promise<void> {
        this._collection = this._createCollection(options.kind, options.items, options);
        this._render = this._kindToRender(options.kind);
        return libraryLoad(this._render).then(() => null);
    }

    protected _afterMount(): void {
        // TODO Item actions should be set on first mouse enter (what about touch devices?)
        if (this._options.itemActions) {
            // FIXME Do not actually call private manager method
            this._collection._itemActionsManager.assignItemActions(
                this._options.itemActions,
                this._options.itemActionsVisibilityCallback
            );
        }
    }

    private _createCollection(
        kind: TCollectionKind,
        items: RecordSet,
        collectionOptions: IContainerOptions
    ): Collection<Model> {
        const name = this._kindToCollection(kind);
        return diCreate(name, { ...collectionOptions, collection: items });
    }

    private _kindToCollection(kind: TCollectionKind): string {
        switch (kind) {
            case 'list':
                return 'Controls/display:Collection';
            case 'tile':
                return 'Controls/display:TileCollection';
        }
        throw new TypeError(`Controls/listRender:Container - the "${kind}" model kind is not supported`);
    }

    private _kindToRender(kind: TCollectionKind): string {
        switch (kind) {
            case 'list':
                return 'Controls/listRender:Render';
            case 'tile':
                return 'Controls/tile:TileRender';
        }
        throw new TypeError(`Controls/listRender:Container - the "${kind}" render kind is not supported`);
    }
}
