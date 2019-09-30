import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/ConstantHeights"
import {Memory} from "Types/source"
import {generateData} from "../../DemoHelpers/DataCatalog"
import 'css!Controls-demo/Controls-demo'

function getNavigation(pageSize: number = 100, page: number = 0) {
    return {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            pageSize,
            page,
            hasMore: false
        }
    }
}

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

    private _navigation = getNavigation();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: this.dataArray
        });
    }
}