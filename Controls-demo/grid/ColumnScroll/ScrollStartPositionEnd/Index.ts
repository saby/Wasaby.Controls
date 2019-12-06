import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/ColumnScroll/ScrollStartPositionEnd/ScrollStartPositionEnd"
import {Memory} from "Types/source"
import {getCountriesStats} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = getCountriesStats().getColumnsWithWidths();
    private _header = getCountriesStats().getDefaultHeader();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
    }
}
