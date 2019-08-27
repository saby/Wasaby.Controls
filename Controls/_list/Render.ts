import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_list/Render/Render');

import defaultItemTemplate = require('wml!Controls/_list/Render/resources/ItemTemplate');
import itemActionsTemplate = require('wml!Controls/_list/Render/resources/ItemActionsTemplate');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem } from 'Controls/display';

export default class Render extends Control {
    protected _template: TemplateFunction = template;

    private _templateKeyPrefix: string;
    private _itemTemplate: TemplateFunction;
    private _itemActionsTemplate: TemplateFunction = itemActionsTemplate;

    protected _beforeMount(options): void {
        this._templateKeyPrefix = `list-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;
    }

    private _onItemClick(e: SyntheticEvent<MouseEvent> & { preventItemEvent?: boolean }, item: CollectionItem<unknown>): void {
        if (!e.preventItemEvent) {
            this._notify('itemClick', [item.getContents(), e], { bubbling: true });
        }
    }

    private _canHaveMultiselect(options): boolean {
        const visibility = options.multiselectVisibility;
        return visibility === 'onhover' || visibility === 'visible';
    }
}
