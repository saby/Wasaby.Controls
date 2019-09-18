import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_list/Render/Render');

import defaultItemTemplate = require('wml!Controls/_list/Render/resources/ItemTemplateWrapper');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem, Collection } from 'Controls/display';

interface IRenderOptions {
    listModel: Collection<unknown>;
    contextMenuEnabled?: boolean;
    contextMenuVisibility?: boolean;
}

export default class Render extends Control<IRenderOptions> {
    protected _template: TemplateFunction = template;

    private _templateKeyPrefix: string;
    private _itemTemplate: TemplateFunction;

    protected _beforeMount(options): void {
        this._templateKeyPrefix = `list-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;
    }

    private _onItemClick(
        e: SyntheticEvent<MouseEvent> & { preventItemEvent?: boolean },
        item: CollectionItem<unknown>
    ): void {
        if (!e.preventItemEvent) {
            this._notify('itemClick', [item.getContents(), e], { bubbling: true });
        }
    }

    private _onItemContextMenu(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>) {
        if (
            this._options.contextMenuEnabled !== false &&
            this._options.contextMenuVisibility !== false &&
            !this._options.listModel.isEditing()
        ) {
            this._notify('itemContextMenu', [item, e, false]);
        }
    }

    private _onItemSwipe(e: SyntheticEvent<null>, item: CollectionItem<unknown>) {
        this._notify('itemSwipe', [item, e]);
        e.stopPropagation();
    }

    private _canHaveMultiselect(options): boolean {
        const visibility = options.multiselectVisibility;
        return visibility === 'onhover' || visibility === 'visible';
    }
}
