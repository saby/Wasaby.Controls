import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Header/LongHeader/LongHeader';
import {Memory} from 'Types/source';
import {getCountriesStats} from '../../DemoHelpers/DataCatalog';
import { IHeader, IColumn } from 'Controls-demo/types';

const MAXITEM = 10;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeader[] = getCountriesStats().getLongHeader(undefined);
    protected _columns: IColumn[] = getCountriesStats().getColumnsWithFixedWidths();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData().slice(0, MAXITEM)
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
