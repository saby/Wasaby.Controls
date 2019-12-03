import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/SourceControl/ChangesSource/ChangesSource"
import {Memory} from "Types/source"
import {getCountriesStats} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

const data = [
    {
        id: 1,
        load: 1
    }, {
        id: 2,
        load: 2
    }, {
        id: 3,
        load: 2
    }, {
        id: 4,
        load: 2
    }, {
        id: 5,
        load: 2
    }, {
        id: 6,
        load: 2
    }, {
        id: 7,
        load: 2
    }];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _viewSource2: Memory;
    private _columns = getCountriesStats().getColumnsForLoad();
    private _loadCounter = 0;
    private _pageSize = 4;
    private _navigationMode = 'infinity';
    private _dataLoad = this._dataLoadCallback.bind(this);

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
                hasMore: false
            },
            viewConfig: {
                pagingMode: 'direct'
            }
        };
        this._viewSource2 = new Memory({
            keyProperty: 'id',
            data: data,
            filter: (item) => {
                return item.get('load') === self._loadCounter;
            }
        });
    }

    private _onChangeSource() {
        const self = this;
        this._viewSource = this._viewSource2;
    }

    private _dataLoadCallback() {
        this._loadCounter++;
    }

    /*private _onChangeSource() {
        this._viewSource.query().then(() => {
            const all = getCountriesStats().getData();
            switch (this.counter) {
                case 0:
                    this._viewSource = new Memory({
                        keyProperty: 'id',
                        data: []
                    });
                    this.counter++;
                    break;
                case 1:
                    this._viewSource = new Memory({
                        keyProperty: 'id',
                        data: all.slice(0, 1)
                    });
                    this.counter++;
                    break;
                case 2:
                    this._viewSource = new Memory({
                        keyProperty: 'id',
                        data: all
                    });
                    this.counter++;
                    break;
                default:
                    break;
            }
        });
    }*/

    // private _onChangeSource2() {
    //     this._viewSource = new Memory({
    //         keyProperty: 'id',
    //         data: getCountriesStats().getData().slice(0, 2)
    //     });
    // }
    //
    // private _onChangeSource3() {
    //     this._viewSource = new Memory({
    //         keyProperty: 'id',
    //         data: getCountriesStats().getData()
    //     });
    // }
}
