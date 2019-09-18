import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/LoadingIndicator/Down/Down"
import {Memory} from "Types/source"
import {generateData} from "../../DemoHelpers/DataCatalog"
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _dataArray = generateData<{id: number, title: string}>({
        count: 100,
        beforeCreateItemCallback: (item) => {
            item.title = `Запись списка с id = ${item.id}.`
        }
    });

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: this._dataArray
        });
        this._slowDownSource(this._viewSource, 5000);
    }

    private _slowDownSource(source: Memory, timeMs: number) {
        const ariginalQuery = source.query;

        source.query = function() {
            const args = arguments;
            return new Promise(function(success) {
                setTimeout(function() {
                    success(ariginalQuery.apply(source, args));
                }, timeMs);
            });
        };
    }

}