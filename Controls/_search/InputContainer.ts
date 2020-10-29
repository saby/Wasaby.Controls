import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_search/InputContainer';
import {SyntheticEvent} from 'UI/Vdom';
import SearchResolver from './SearchResolver';
import {ISearchInputContainerOptions} from './interface';
import {default as Store} from 'Controls/Store';

export default class InputContainer extends Control<ISearchInputContainerOptions> {
   protected _template: TemplateFunction = template;

   protected _value: string;
   protected _searchResolverController: SearchResolver = null;

   protected _beforeMount(options?: ISearchInputContainerOptions): void {
      this._initSearchDelayController(options);

      if (this._options.inputSearchValue !== options.inputSearchValue) {
         this._value = options.inputSearchValue;
      }
   }

   protected _beforeUpdate(newOptions: ISearchInputContainerOptions): void {
      if (this._options.inputSearchValue !== newOptions.inputSearchValue) {
         this._value = newOptions.inputSearchValue;
      }
   }

   protected _initSearchDelayController(options: ISearchInputContainerOptions): void {
      if (!this._searchResolverController) {
         this._searchResolverController = new SearchResolver({
            delayTime: options.delayTime,
            minSearchLength: options.minSearchLength,
            searchCallback: this._notifySearch.bind(this),
            searchResetCallback: this._notifySearchReset.bind(this)
         });
      }
   }

   protected _notifySearch(value: string): void {
      this._resolve(value);
   }

   private _resolve(value: string): void {
      if (this._options.useStore) {
         Store.dispatch('searchValue', value);
      } else {
         this._notify('search', [value || ''], {bubbling: true});
      }
   }

   protected _notifySearchReset(): void {
      this._notify('searchReset', [], {bubbling: true});
   }

   protected _searchClick(event: SyntheticEvent): void {
      if (this._value) {
         this._resolve(this._value);
      }
   }

   protected _valueChanged(event: SyntheticEvent, value: string): void {
      if (this._value !== value) {
         this._value = value;
         this._searchResolverController.resolve(value);
      }
   }
}
