import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/List/Render/Render');

import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IListItem {
    key: number;
    title: string;
}

const LIST_ITEMS_COUNT = 100;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    private _nextKey: number = 0;
    private _viewSource: Memory;
    private _multiSelectVisibility: string = 'hidden';

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._generateListItems(LIST_ITEMS_COUNT)
        });
    }

    protected _afterMount(): void {
        // remove all after debugging
        window.model = this._children.listView._children.listControl._children.baseControl.getViewModel();

        // setup item action
        const itemAction = {
            id: 1,
            icon: 'icon-PhoneNull controls-itemActionsV__action_icon  icon-size',
            title: 'phone',
            style: 'success',
            iconStyle: 'success',
            showType: 0
        };
        window.model.each((item) => { window.model.setItemActions(item, { all: [itemAction], showed: [itemAction] }) });

        // fix for multiselect breaking
        window.model.updateSelection = function() {};

        setTimeout(() => {
            window.model._nextVersion();
        }, 5);
    }

    private _changeMultiselect(e: SyntheticEvent<null>, visibility: string): void {
        this._multiSelectVisibility = visibility;
    }

    private _changeSwiped(e: SyntheticEvent<null>, swiped: boolean): void {
        // no swipe controller yet
        window.model.at(0).setSwiped(swiped);
        window.model._nextVersion();
    }

    private _changeEditing(e: SyntheticEvent<null>, editing: boolean): void {
        window.model.setEditingItem(editing ? window.model.at(0) : null);
    }

    private _generateListItems(count: number): IListItem[] {
        const result = [];
        while (count--) {
            result.push(this._generateListItem());
        }
        return result;
    }

    private _generateListItem(): IListItem {
        const key = this._nextKey++;
        return {
            key,
            title: `${key} list element`
        };
    }
}
