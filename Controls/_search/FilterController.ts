import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_search/FilterController';
import * as clone from 'Core/core-clone';
import {isEqual} from 'Types/object';
import {_assignServiceFilters} from 'Controls/_search/Utils/FilterUtils';

export interface ISearchFilterController extends IControlOptions {
   searchValue: string;
   searchParam: string;
   filter: object;
   minSearchLength: number;
}

export default class SearchFilterController extends Control<ISearchFilterController> {
   protected _template: TemplateFunction = template;
   protected _filter: object = null;

   protected _beforeMount(options: ISearchFilterController): void {
      this._filter = this.getFilter(options);
   }

   protected _beforeUpdate(newOptions: ISearchFilterController): void {
      if (!isEqual(this._options.filter, newOptions.filter)) {
         this._filter = this.getFilter(newOptions);
      }
   }

   private static prepareFilter(filter: object, searchValue?: string, searchParam?: string): object {
      const preparedFilter = clone(filter) || {};

      if (searchValue && searchParam) {
         preparedFilter[searchParam] = searchValue;
         _assignServiceFilters({}, preparedFilter, true);
      }

      return preparedFilter;
   }

   private getFilter(options: ISearchFilterController): object {
      return options.searchValue && options.searchValue.length < options.minSearchLength ? clone(options.filter) || {} :
          SearchFilterController.prepareFilter(options.filter, options.searchValue, options.searchParam);
   }
}

SearchFilterController.getDefaultOptions = function () {
   return {
      minSearchLength: 3
   };
};
