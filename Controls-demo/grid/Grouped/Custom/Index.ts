import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/Grouped/Custom/Custom"
import {Memory} from "Types/source"
import {getTasks} from "../../DemoHelpers/DataCatalog";

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = getTasks().getDefaultColumns();
    private _groupingKeyCallback = (item) => {
        return item.get('fullName');
    }
    private header = [
        {
            title: '',
            startRow: 1,
            endRow: 3,
            startColumn: 1,
            endColumn: 2
        },
        {
            title: '2',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3
        },
        {
            title: '3',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4
        },
        {
            title: '1',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 4
        }
    ]

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getTasks().getData()
        });
    }
}
