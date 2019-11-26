import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Searching/PortionedSearch/PortionedSearch';
import PortionedSearchSource from 'Controls-demo/list_new/Searching/PortionedSearch/Source';
import {Memory} from 'Types/source';
import {generateData} from '../../DemoHelpers/DataCatalog';
import 'css!Controls-demo/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: PortionedSearchSource = null;
    private _filter: Object = null;
    private _dataArray: object[] = generateData({count: 100, entityTemplate: {title: 'lorem'}});
    private _searchValue: string = '';

    protected _beforeMount(): void {
        this._viewSource = new PortionedSearchSource({
            source: new Memory({
                keyProperty: 'id',
                data: this._dataArray,
                filter: (item, query) => {
                    let res = true;

                    if (query.title) {
                        res = item.get('title').toLowerCase().includes(query.title);
                    }

                    return res;
                }
            })
        });
        this._filter = {};
    }

    private _startSearch(): void {
        this._searchValue = 'lorem';
        this._filter = {
           title: this._searchValue
        };
    }

    private _resetSearch(): void {
        this._searchValue = '';
        this._filter = {};
    }

}
