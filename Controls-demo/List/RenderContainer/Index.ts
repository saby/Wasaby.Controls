import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/List/RenderContainer/RenderContainer');

import { RecordSet } from 'Types/collection';

export default class RenderContainerDemo extends Control {
    protected _template: TemplateFunction = template;

    private _items: RecordSet;
    protected _itemActions: any[];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: this._generateRawData(10),
            keyProperty: 'id'
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
                id: 2,
                icon: 'icon-Edit',
                title: 'fake',
                style: 'success',
                iconStyle: 'success',
                showType: 0
            }
        ];
    }

    private _generateRawData(n: number): any[] {
        const rawData = [];
        for (let i = 0; i < n; i++) {
            rawData.push({
                id: i,
                title: `${i} item`,
                image: `https://picsum.photos/600/500?uniqueKey=${i}`
            });
        }
        return rawData;
    }
}
