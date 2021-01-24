import {Control, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import * as Template from 'wml!Controls-demo/grid/EditInPlace/SingleCellEditable/SingleCellEditable';
import {getEditing, IColumnRes} from '../../DemoHelpers/DataCatalog';
import * as cellTemplate from 'wml!Controls-demo/grid/EditInPlace/SingleCellEditable/cellTemplate';
import {Model} from "Types/entity";


export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _addingItemId: number = 3;

    protected _columns: IColumnRes[] = getEditing().getEditingColumns().map((column, index) => ({
        ...column,
        editable: index === 0 || index === 3 ? false : undefined,
        template: !(index === 0 || index === 3) ? cellTemplate : undefined
    }));

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getEditing().getEditingData()
        });
    }

    protected _beginAdd() {
        this._children.grid.beginAdd({
            item: new Model({
                keyProperty: 'id',
                rawData: {
                    id: ++this._addingItemId,
                    title: null,
                    description: null,
                    price: null,
                    balance: null,
                    balanceCostSumm: null,
                    reserve: null,
                    costPrice: null
                }
            })
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
