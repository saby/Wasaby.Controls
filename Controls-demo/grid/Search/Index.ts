import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/Search/Search"
import {Memory} from "Types/source"
import {getCountriesStats} from "../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _filter = {};
    // private _searchStartingWith: string = 'country';
    private _columns = getCountriesStats().getColumnsWithFixedWidths();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
    }
}
