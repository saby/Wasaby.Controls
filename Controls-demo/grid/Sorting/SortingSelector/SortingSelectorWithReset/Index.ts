import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Sorting/SortingSelector/SortingSelectorWithReset/SortingSelectorWithReset';
import {Memory} from 'Types/source';
import {getCountriesStats} from '../../../DemoHelpers/DataCatalog';

import 'css!Controls-demo/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _sortingParameters: object[] = [];
    private _sorting: object[] = [];
    private _viewSource: Memory;
    private _sortingSource: Memory;
    private _columns: object[] = getCountriesStats().getColumnsWithWidths();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
        this._sortingParameters = [
            {
                id: 1,
                title: 'Без сортировки',
                parameterName: null
            },
            {
                id: 2,
                title: 'По населению',
                parameterName: 'population'
            },
            {
                id: 3,
                title: 'По площади',
                parameterName: 'square'
            },
            {
                id: 4,
                title: 'По плотности населения',
                parameterName: 'populationDensity'
            }
        ];
        this._sortingSource = new Memory({
            data: this._sortingParameters,
            keyProperty: 'id'
        });
    }
}
