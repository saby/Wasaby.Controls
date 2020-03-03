import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/List/ScrollToEnd/ScrollToEnd');
import { Memory } from 'Types/source';

export default class ScrollToEnd extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;
    protected _navigation = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            pageSize: 40,
            direction: 'both',
            page: 0,
            hasMore: false
        },
        viewConfig: {
            pagingMode: 'direct',
            showEndButton: true
        }
    };

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: this._createItems(1000)
        });
    }

    private _createItems(count: number): unknown[] {
        const items = [];
        while (count--) {
            items.unshift({
                id: count,
                title: `item #${count}`
            });
        }
        return items;
    }
}
