import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/List/TileRender/TileRender');

import { Memory } from 'Types/source';

interface ITileItem {
    key: number;
    title: string;
    image: string;
}

const LIST_ITEMS_COUNT = 100;

export default class TileRenderDemo extends Control {
    protected _template: TemplateFunction = template;

    private _nextKey: number = 0;
    private _viewSource: Memory;
    private _multiSelectVisibility: string = 'hidden';

    private _itemActions: any;
    private _navigation: any;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._generateTileItems(LIST_ITEMS_COUNT)
        });
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                style: 'success',
                iconStyle: 'success',
                showType: 0,
                handler: (item) => alert(`phone clicked at ${item.getId()}`)
            },
            {
                id: 3,
                icon: 'icon-Erase',
                style: 'error',
                iconStyle: 'error',
                title: 'delete',
                showType: 0,
                handler: (item) => this._children.tileView._children.listControl._children.baseControl.getViewModel().getCollection().remove(item)
            }
        ];
    }

    private _generateTileItems(count: number): ITileItem[] {
        const result = [];
        while (count--) {
            result.push(this._generateTileItem());
        }
        return result;
    }

    private _generateTileItem(): ITileItem {
        const key = this._nextKey++;
        return {
            key,
            title: `${key} list element`,
            image: `https://picsum.photos/300/200?uniqueKey=${key}`
        };
    }
}
