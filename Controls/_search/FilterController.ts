import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_search/FilterController';
import * as clone from 'Core/core-clone';
import {isEqual} from 'Types/object';

export interface ISearchFilterController extends IControlOptions {
   searchValue: string;
   searchParam: string;
   filter: object;
}

export default class SearchFilterController extends Control<ISearchFilterController> {
   protected _template: TemplateFunction = template;
   protected _filter: object = null;

   protected _beforeMount(options: ISearchFilterController): void {
      this._filter = SearchFilterController.prepareFilter(options.filter, options.searchValue, options.searchParam);
   }

   protected _beforeUpdate(newOptions: ISearchFilterController): void {
      if (!isEqual(this._options.filter, newOptions.filter)) {
         this._filter = newOptions.filter;
      }
   }

   private static prepareFilter(filter: object, searchValue?: string, searchParam?: string): object {
      const preparedFilter = clone(filter) || {};

      if (searchValue && searchParam) {
         preparedFilter[searchParam] = searchValue;
      }

      return preparedFilter;
   }
}
