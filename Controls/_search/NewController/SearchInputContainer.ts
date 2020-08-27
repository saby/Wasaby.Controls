import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_search/NewController/SearchInputContainer';
import {SyntheticEvent} from 'UI/Vdom';
import SearchDelay from './SearchDelay';

export interface ISearchContainerOptions extends IControlOptions {
   delayTime?: number | null;
   minSearchValueLength?: number;
}

export default class SearchInputContainer extends Control<ISearchContainerOptions> {
   protected _template: TemplateFunction = template;

   protected _value: string;
   protected _searchDelayController: SearchDelay = null;

   protected _beforeMount(options?: ISearchContainerOptions): void {
      this._initSearchDelayController();
   }

   protected _initSearchDelayController(): void {
      if (!this._searchDelayController) {
         this._searchDelayController = new SearchDelay({
            delayTime: this._options.delayTime,
            minSearchValueLength: this._options.minSearchValueLength,
            searchCallback: this._notifySearch,
            searchResetCallback: this._notifySearchReset
         });
      }
   }

   protected _notifySearch(value: string): void {
      this._notify('search', [value || ''], {bubbling: true});
   }

   protected _notifySearchReset(): void {
      this._notify('searchReset', [], {bubbling: true});
   }

   protected _searchClick(event: SyntheticEvent): void {
      if (this._value) {
         this._notify('search', [this._value || ''], {bubbling: true});
      }
   }

   protected _valueChanged(event: SyntheticEvent, value: string): void {
      if (this._value !== value) {
         this._value = value;
         this._searchDelayController.resolve(value);
      }
   }
}
