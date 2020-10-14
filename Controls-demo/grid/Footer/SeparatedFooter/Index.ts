import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Footer/SeparatedFooter/SeparatedFooter';
import {Memory} from 'Types/source';
import {getCountriesStats} from '../../DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = getCountriesStats().getColumnsWithoutWidths();

    protected _beforeMount(): void {
        this._columns[1].cellPadding = {
            left: 'S'
        };
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData().slice(0, 7)
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
