import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/List/Render/Render');

import { Memory } from 'Types/source';

interface IListItem {
    key: number;
    title: string;
}

const LIST_ITEMS_COUNT = 100;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    private _nextKey: number = 0;
    private _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._generateListItems(LIST_ITEMS_COUNT)
        });
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
