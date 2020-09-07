import {ISearchFilterController} from "./FilterController";
import {_assignServiceFilters} from 'Controls/_search/Utils/FilterUtils';
import {isEqual} from 'Types/object';
import * as clone from 'Core/core-clone';

export interface ISearchFilterController {
    searchValue: string;
    searchParam: string;
    filter: object;
    minSearchLength: number;
    parentProperty: string|void;
}

export default class SearchFilterController {
    private _filter: object;
    private _options: ISearchFilterController;


    constructor(options) {
        this._filter = SearchFilterController._getFilter(options);

        this._options = options;
    }

    update(options): void {
        if (!isEqual(this._options.filter, options.filter)) {
            this._filter = SearchFilterController._getFilter(options);
        }
        this._options = options;
    }

    private static _getFilter(options: ISearchFilterController): object {
        if (options.searchValue && options.searchValue.length < options.minSearchLength) {
            return clone(options.filter) || {};
        } else {
            return SearchFilterController._prepareFilter(options.filter, options.searchValue,
                options.searchParam, options.parentProperty);
        }
    }

    private static _prepareFilter(filter: object,
                                 searchValue?: string,
                                 searchParam?: string,
                                 parentProperty?: string|void): object {
        const preparedFilter = clone(filter) || {};

        if (searchValue && searchParam) {
            preparedFilter[searchParam] = searchValue;
            _assignServiceFilters({}, preparedFilter, parentProperty);
        }

        return preparedFilter;
    }
}
