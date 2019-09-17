import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/Navigation/DigitPaging/WithItemActions/WithItemActions"
import {Memory} from "Types/source"
import {generateData} from "../../../DemoHelpers/DataCatalog"
import {getActionsForContacts as getItemActions} from "../../../DemoHelpers/ItemActionsCatalog"
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _itemActions = getItemActions();
    private _dataArray = generateData({
        count: 100,
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с идентификатором ${item.id} и каким то не очень длинным текстом`;
        }
    });

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: this._dataArray
        });
    }
}
