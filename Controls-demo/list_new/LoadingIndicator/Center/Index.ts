import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/LoadingIndicator/Center/Center"
import {Memory} from "Types/source"
import {getFewCategories as getData} from "../../DemoHelpers/DataCatalog"
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

    private _reloadList(): void {
        this._slowDownSource(this._viewSource, 3000);
        this._children.list.reload();
    }

    private _slowReload(): void {
        this._slowDownSource(this._viewSource, 300000000);
        this._children.list.reload();
    }

    private _slowDownSource(source: Memory, timeMs: number) {
        const ariginalQuery = source.query;
        const self = this;

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