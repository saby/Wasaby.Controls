import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/Columns/Width/Width"
import {Memory} from "Types/source"
import {forShowWidths} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;

    private _header = forShowWidths().getHeader();
    private _columns = forShowWidths().getColumns1();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: forShowWidths().getData()
        });
    }
}