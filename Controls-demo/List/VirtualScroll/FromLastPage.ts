import Control = require('Core/Control')
import template = require('wml!Controls-demo/List/VirtualScroll/resources/BaseTemplate')
import {Memory} from 'Types/source'
import {createItems} from './resources/Data'
import 'css!Controls-demo/List/VirtualScroll/resources/Common'



class FromLastPage extends Control {
    [x: string]: any;
    private _template: Function = template;
    private _listName: string = 'myList';
    private _viewSource: Memory;
    private _itemsCount: number = 1000;
    private _virtualPageSize: number = 20;
    private _navigation = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            pageSize: 40,
            direction: 'both',
            page: 0,
            hasMore: false
        },
        viewConfig: {
            pagingMode: 'direct'
        }
    };

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: createItems(this._itemsCount)
        });
    }

    protected _afterMount() {
        this._children[this._listName].reload();
    }

}

export = FromLastPage;
