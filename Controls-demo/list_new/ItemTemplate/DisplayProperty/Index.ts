import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/ItemTemplate/DisplayProperty/DisplayProperty"
import {Memory} from "Types/source"
import {getFewCategories as getData} from "../../DemoHelpers/DataCatalog"
import 'wml!Controls-demo/list_new/ItemTemplate/FromFile/TempItem'
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
    }
}
