import Control = require('Core/Control')
import template = require('wml!Controls-demo/List/VirtualScroll/resources/BaseTemplate')
import {Memory} from 'Types/source'
import {createItems} from './resources/Data'
import 'css!Controls-demo/List/VirtualScroll/resources/Common'



class EqualPages extends Control {
    [x: string]: any;
    private _template: Function = template;
    private _listName: string = 'myList';
    private _viewSource: Memory;
    private _itemsCount: number = 1000;
    private _virtualPageSize: number = 40;
    private _virtualSegmentSize: number = 5;
    private _navigation = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            pageSize: 40,
            page: 0,
            hasMore: false
        }
    };

    protected _beforeMount() {
        this._viewSource = new Memory({
            idProperty: 'id',
            data: createItems(this._itemsCount)
        });
    }

    protected _afterMount() {
        this._children[this._listName].reload();
    }

}

export = EqualPages;