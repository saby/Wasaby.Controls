import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as template from 'wml!Controls-demo/List/Display/DisplayList/DisplayList';

import { Controller as SourceController } from 'Controls/source';
import { CollectionItem, Collection, Abstract } from 'Controls/display';

import { ICrud } from 'Types/source';
import { RecordSet } from 'Types/collection';

import 'css!Controls-demo/List/Display/DisplayList/DisplayList';

interface IDisplayListOptions extends IControlOptions {
    keyProperty: string;
    displayProperty: string;

    source?: ICrud;
}

export default class DisplayList<TItem> extends Control<IDisplayListOptions> {
    protected _template: TemplateFunction = template;

    private _sourceController: SourceController;
    private _collection: Collection<TItem>;

    protected _beforeMount(options: IDisplayListOptions) {
        if (options.source) {
            this._sourceController = new SourceController({
                source: options.source,
                keyProperty: options.keyProperty
            });
            return this._loadItems().then((rs) => {
                this._collection = this._prepareCollection(rs, options);
            });
        }
    }

    private _loadItems(): Promise<RecordSet<TItem>> {
        return this._sourceController.load();
    }

    private _prepareCollection(items: RecordSet<TItem>, options: IDisplayListOptions): Collection<TItem> {
        return Abstract.getDefaultDisplay(
            items,
            {
                idProperty: options.keyProperty,
                displayProperty: options.displayProperty
            }
        ) as Collection<TItem>;
    }

    private _onItemClick(e: SyntheticEvent<MouseEvent>, item: CollectionItem<TItem>): void {
        // TODO remove, this is for demo
        this._collection.setMarkedItem(item);
        this._notify('itemClick', [item.getContents(), e], { bubbling: true });
    }
}
