import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Header/Multiheader/TextOverflow/TextOverflow';
import {Memory} from 'Types/source';
import {getCountriesStats} from '../../../DemoHelpers/DataCatalog';
import {IColumn} from 'Controls/grid';
import {IHeader} from 'Controls-demo/types';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeader[] = getCountriesStats().getMultiHeader();
    protected _columns: IColumn[] = getCountriesStats().getColumnsWithWidthsForSortingDemo();

    protected _beforeMount(): void {
        for (let i = 0; i < 4; i++) {
            this._header[1].title += ` ${this._header[1].title}`;
            this._header[4].title += ` ${this._header[4].title}`;
        }
        this._header[1].textOverflow = 'ellipsis';
        this._header[4].textOverflow = 'none';

        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
