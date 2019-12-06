import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/SourceChanger/WithFull/WithFull"
import {Memory} from "Types/source"
import {getCountriesStats, changeSourceData} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

const { data, data2 } = changeSourceData();

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

class demoSource extends Memory {
    queryNumber: number = 0;
    pending: Promise<any>;
    private query(query) {
        const self = this;
        return delay(2500).then(() => {
            return super.query.apply(this, arguments).addCallback((items) => {
                const rawData = items.getRawData();
                rawData.items = data2.filter((cur) => cur.load === this.queryNumber);
                rawData.meta.more = this.queryNumber < 2;
                rawData.meta.total = rawData.items.length;
                items.setRawData(rawData);
                this.queryNumber++;
                return items;
            });
        });

    }
}

class initialMemory extends Memory {
    private query(query) {
        return super.query.apply(this, arguments).addCallback((items) => {
            const rawData = items.getRawData();
            rawData.meta.more = false;
            items.setRawData(rawData); //dsadsa
            return items;
        });
    }
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _viewSource2: Memory;
    private _columns = getCountriesStats().getColumnsForLoad();

    protected _beforeMount() {
        const self = this;
        this._viewSource = new initialMemory({
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
    }

    private _onChangeSource() {
        this._viewSource2.queryNumber = 0;
        this._viewSource = this._viewSource2;
    }

}
