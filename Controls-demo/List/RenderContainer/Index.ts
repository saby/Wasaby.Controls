import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/List/RenderContainer/RenderContainer');

import * as images from 'Controls-demo/Explorer/ExplorerImages';

import { RecordSet } from 'Types/collection';
import { Memory as MemorySource } from 'Types/source';

const NUMBER_OF_ITEMS = 100;

export default class RenderContainerDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _items: RecordSet;
    protected _itemsSource: MemorySource;

    protected _itemActions: any[];

    protected _showNewView: boolean = true;
    protected _showOldView: boolean = true;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: this._generateRawData(NUMBER_OF_ITEMS),
            keyProperty: 'id'
        });
        this._itemsSource = new MemorySource({
            data: this._generateRawData(NUMBER_OF_ITEMS),
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
                style: 'danger',
                iconStyle: 'danger',
                showType: 0
            }
        ];
    }

    protected _toggleNewView(): void {
        this._showNewView = !this._showNewView;
    }

    protected _toggleOldView(): void {
        this._showOldView = !this._showOldView;
    }

    private _generateRawData(n: number): any[] {
        const rawData = [];
        for (let i = 0; i < n; i++) {
            rawData.push({
                id: i,
                title: `${i} item`,
                image: images[i % images.length]
            });
        }
        return rawData;
    }
}
