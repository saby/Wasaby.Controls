import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/GroupView/TreeGridView/TreeGridView';
import {Memory} from 'Types/source';
import {Gadgets} from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: unknown[] = Gadgets.getGridColumnsForFlat();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: this._prepareData()
        });
    }

    private _prepareData(): any {
        return Gadgets.getFlatData().map((data) => {
            if ([1, 2, 3, 4, 5].indexOf(data.id) !== -1) {
                data.nodeType = 'group';
            }
            return data;
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
