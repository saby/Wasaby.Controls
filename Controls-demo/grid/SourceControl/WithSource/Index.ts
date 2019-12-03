import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/EmptyGrid/WithSource/WithSource"
import {Memory} from "Types/source"
import {getCountriesStats} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = getCountriesStats().getColumnsWithoutWidths();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
    }

    private _onChangeSource() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: []
        });
    }

    private _onChangeSource2() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData().slice(0, 2)
        });
    }

    private _onChangeSource3() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
    }
}
