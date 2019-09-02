import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/Ladder/NoSticky/NoSticky"
import {Memory} from "Types/source"
import {getTasks} from "../../DemoHelpers/DataCatalog"

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = getTasks().getColumns();
    private _ladderProperties = ['photo', 'date'];

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getTasks().getData()
        });
    }
}