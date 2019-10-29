import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import template = require('wml!Controls/_listRender/View/View');

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { create as diCreate } from 'Types/di';

import { Collection } from 'Controls/display';

import { load as libraryLoad } from 'Core/library';
import { SyntheticEvent } from 'Vdom/Vdom';

export interface IViewOptions extends IControlOptions {
    items: RecordSet;

    collection: string;
    render: string;
}

export default class View extends Control<IViewOptions> {
    protected _template: TemplateFunction = template;

    protected _collection: Collection<Model>;

    protected _dropdownMenuIsOpen: boolean = false;

    protected async _beforeMount(options: IViewOptions): Promise<void> {
        this._collection = this._createCollection(options.collection, options.items, options);
        return libraryLoad(options.render).then(() => null);
    }

    protected _beforeUnmount(): void {
        this._collection.destroy();
        this._collection = null;
    }

    protected _onDropdownMenuOpenRequested(event: SyntheticEvent<null>, dropdownConfig: any): void {
        if (this._children.dropdownMenuOpener) {
            this._children.dropdownMenuOpener.open(dropdownConfig);
            this._dropdownMenuIsOpen = true;
        }
    }

    protected _onDropdownMenuCloseRequested(): void {
        if (this._children.dropdownMenuOpener) {
            this._children.dropdownMenuOpener.close();
            this._dropdownMenuIsOpen = false;
        }
    }

    private _createCollection(
        module: string,
        items: RecordSet,
        collectionOptions: IViewOptions
    ): Collection<Model> {
        return diCreate(module, { ...collectionOptions, collection: items });
    }
}
