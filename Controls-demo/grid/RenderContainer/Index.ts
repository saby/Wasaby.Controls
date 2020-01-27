import { Control, TemplateFunction } from 'UI/Base';

import template = require('wml!Controls-demo/grid/RenderContainer/RenderContainer');
import { RecordSet } from 'Types/collection';

export default class GridRenderContainerDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _items: RecordSet = this._generateItems(100);
    protected _columns = [
        {
            template: 'abc'
        },
        {
            template: 'def'
        }
    ];

    private _generateItems(count: number) {
        const rawData = [];
        for (let i = 0; i < count; i++) {
            rawData.push(this._generateItem(i));
        }
        return new RecordSet({
            rawData,
            keyProperty: 'key'
        });
    }

    private _generateItem(key: number) {
        return {
            key,
            title: `item ${key}`,
            subtitle: `${7*key*key % 101} -- ${9*key % 102}`
        };
    }
}
