import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/SourceControl/ChangesSource/ChangesSource"
import {Memory} from "Types/source"
import {getCountriesStats} from "../../DemoHelpers/DataCatalog"
import Deferred = require('Core/Deferred');

import 'css!Controls-demo/Controls-demo'


const data = [
    {
        id: 1,
        load: 1,
        title: 'hello'
    }, {
        id: 2,
        load: 2,
        title: 'hello'

    }, {
        id: 3,
        load: 2,
        title: 'hello'

    }, {
        id: 4,
        load: 2,
        title: 'hello'

    }, {
        id: 5,
        load: 2,
        title: 'hello'

    }, {
        id: 6,
        load: 2,
        title: 'hello'

    }, {
        id: 7,
        load: 2,
        title: 'hello'

    }];

class demoSource extends Memory {
    queryNumber: number = 0;
    pending: Promise<any>;
    private query(query) {
        const self = this;
        // return this.pending.addCallback(() => {
        return super.query.apply(this, arguments).addCallback((items) => {
            const rawData = items.getRawData();
            rawData.items = data.filter((cur) => cur.load === this.queryNumber);
            rawData.meta.more = this.queryNumber < 2;
            rawData.meta.total = rawData.items.length;
            items.setRawData(rawData);
            this.queryNumber++;
            return items;
        });
        // })

    }
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _viewSource2: Memory;
    private _columns = getCountriesStats().getColumnsForLoad();
    // private queryNumber = 0;
    // private _dataLoadCallback = this._dataLoad.bind(this);

    protected _beforeMount() {
        const self = this;
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: []
        });
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                pageSize: 3,
                page: 0,
            },
        };
        this._viewSource2 = new demoSource({
            keyProperty: 'id',
            data: data,
        });
        // window.testCounter = 0;
        // const originalQuery = this._viewSource2.query;
        // this._viewSource2.query = function() {
        //     // self.queryNumber = 0;
        //     return originalQuery.apply(this, arguments).addCallback(function(items) {
        //         const rawData = items.getRawData();
        //         rawData.meta.more = window.testCounter < 2;
        //         items.setRawData(rawData);
        //         window.testCounter++;
        //         return items;
        //     })
        // }


        // this._viewSource2.pending = new Deferred();
    }

    // private onPending() {
    //     this._viewSource2.pending.callback();
    // }

    private _onChangeSource() {
        this._viewSource2.queryNumber = 0;
        this._viewSource = this._viewSource2;
    }

    // private _dataLoad() {
    //     this._viewSource2.queryNumber++;
    // }

}
