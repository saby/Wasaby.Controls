import * as template from 'wml!Controls-demo/Filter_new/SearchContainer';
import {Control, TemplateFunction} from 'UI/Base';
import SearchStore from './SearchStore';

class SearchContainer extends Control {
    protected _template: TemplateFunction = template;
    protected _searchValue: string = '';

    protected _beforeMount(options, context): void {
        this._searchValue = context.searchStore.searchValue;
    }
    protected _beforeUpdate(options, context): void {
        if (this._searchValue !== context.searchStore.searchValue) {
            this._searchValue = context.searchStore.searchValue;
        }
    }
}
SearchContainer.contextTypes = () => {
    return {
        searchStore: SearchStore
    };
};
export default SearchContainer;
