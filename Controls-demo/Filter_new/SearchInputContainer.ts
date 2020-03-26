import {TemplateFunction, Control} from 'UI/Base';
import * as template from 'wml!Controls-demo/Filter_new/SearchInputContainer';
import Dispatcher from './Dispatcher';
import SearchStore from './SearchStore';
import {startSearch} from './SearchActions';

class DemoInputContainer extends Control {
    protected _template: TemplateFunction = template;
    protected _value: string = '';

    protected _beforeMount(options, context): void {
        this._value = context.searchStore.searchValue;
        this._dispatcher = context.dispatcher;
    }

    protected _beforeUpdate(options, context): void {
        this._value = context.searchStore.searchValue;
    }

    private _valueChanged(event, value: string): void {
        startSearch({
            searchValue: value
        }, this._dispatcher);
    }
}

DemoInputContainer.contextTypes = () => {
    return {
        dispatcher: Dispatcher,
        searchStore: SearchStore
    };
};

export default DemoInputContainer;
