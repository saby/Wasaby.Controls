import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls-demo/Filter_new/SearchContainer';
import SearchStore from './SearchStore';
import Dispatcher from './Dispatcher';

class SearchController extends Control {
    protected _template: TemplateFunction = template;
    protected _value: string = '';
    protected _store: SearchStore = {};

    protected _beforeMount(options, context) {
        this._store = new SearchStore({
            searchValue: options.value
        }, context.dispatcher);
    }

    protected _getChildContext = () => {
        return {
            searchStore: this._store
        };
    }
}

SearchController.contextTypes = () => {
    return {
        dispatcher: Dispatcher
    };
};
export default SearchController;
