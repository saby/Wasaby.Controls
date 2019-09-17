import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/EditInPlace/Base/Base"
import {Memory} from "Types/source"
import {getPorts} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = getPorts().getColumns();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getPorts().getData()
        });
    }
}