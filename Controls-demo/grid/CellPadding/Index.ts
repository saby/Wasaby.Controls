import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/CellPadding/CellPadding"
import {Memory} from "Types/source"
import {cellPadding, getCountriesStats} from "../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = cellPadding().getCollumns();
    private _header = cellPadding().getCellPaddingHeader();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: cellPadding().getData().slice(0, 5)
        });
    }
}
