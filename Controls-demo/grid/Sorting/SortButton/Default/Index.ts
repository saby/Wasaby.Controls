import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Sorting/SortButton/Default/Default';
import {Memory} from 'Types/source';
import {getCountriesStats} from '../../../DemoHelpers/DataCatalog';

import 'css!Controls-demo/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _sortingParameters = [];
    private _sorting = [];
    private _viewSource: Memory;
    private _columns = getCountriesStats().getColumnsWithWidths();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getCountriesStats().getData()
        });
        this._sortingParameters = [
            {
                title: 'По населению',
                parameterName: 'population'
            },
            {
                title: 'По площади',
                parameterName: 'square'
            },
            {
                title: 'По плотности населения',
                parameterName: 'populationDensity'
            }
        ];
        this._sorting.push({population: 'ASC'});
    }
}
