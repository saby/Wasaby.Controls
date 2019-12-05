import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/SourceChanger/WithFull/WithFull"
import {Memory} from "Types/source"
import {getCountriesStats} from "../../DemoHelpers/DataCatalog"
import Deferred = require('Core/Deferred');

import 'css!Controls-demo/Controls-demo'


const data = [
    {
        id: 1,
        load: 'hello',
        title: 'hello'
    }, {
        id: 2,
        load: 'hello',
        title: 'hello'

    }, {
        id: 3,
        load: 'hello',
        title: 'hello'

    }, {
        id: 4,
        load: 'hello',
        title: 'hello'

    }, {
        id: 5,
        load: 'hello',
        title: 'hello'

    }, {
        id: 6,
        load: 'hello',
        title: 'hello'

    }, {
        id: 7,
        load: 'hello',
        title: 'hello'

    }];

const data2 = [
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
            const newItems = data2.filter((cur) => cur.load === this.queryNumber);
            if (true) {
                rawData.items = newItems;
                rawData.meta.total = rawData.items.length;
            }

            rawData.meta.more = this.queryNumber < 2;
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

    protected _beforeMount() {
        const self = this;
        this._viewSource = new demoSource({
            keyProperty: 'id',
            data: data
        });
        this._navigation = {
            source: 'page',
            view: 'maxCount',
            sourceConfig: {
                pageSize: 10,
                page: 0,
            },
            viewConfig: {
                maxCountValue: 8
            }
        };
        this._viewSource2 = new demoSource({
            keyProperty: 'id',
            data: data2,
        });


        // this._viewSource2.pending = new Deferred();
    }

    // private onPending() {
    //     this._viewSource2.pending.callback();
    // }

    private _onChangeSource() {
        this._viewSource2.queryNumber = 0;
        this._viewSource = this._viewSource2;
    }


}
