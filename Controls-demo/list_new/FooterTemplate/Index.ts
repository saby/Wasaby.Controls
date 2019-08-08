import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/FooterTemplate/FooterTemplate"
import {Memory} from "Types/source"
import {FewCategories as Data} from "../DemoHelpers/DataCatalog"
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
}