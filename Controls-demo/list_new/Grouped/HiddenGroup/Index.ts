import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/Grouped/HiddenGroup/HiddenGroup"
import {Memory} from "Types/source"
import {Model} from "Types/entity"
import {GroupedCatalogWithHiddenGroup as Data} from "../../DemoHelpers/DataCatalog"
import CONSTANTS = require("Controls/Constants");
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: Data
        });
    }

    private _groupingKeyCallback(item: Model): string {
        if (item.get('brand') === 'unknown' || !item.get('brand')) {
            return CONSTANTS.view.hiddenGroup;
        }
        return item.get('brand');
    }
}