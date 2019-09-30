import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/ScrollToItem/ScrollToItem"
import {Memory} from "Types/source"
import {generateData} from "../../../DemoHelpers/DataCatalog"
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;

    private dataArray = generateData({
        keyProperty: 'id',
        count: 1000,
        beforeCreateItemCallback: item => {
            item.title = `Запись с ключом ${item.id}.`
        }
    });

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: this.dataArray
        });
    }

    private _scrollToItem(e, id: number) {
        this._children.list.scrollToItem(id);
    }
}