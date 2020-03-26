import {TemplateFunction, Control} from 'UI/Base';
import * as template from 'wml!Controls-demo/Filter_new/DispatchContainer';
import Dispatcher from './Dispatcher';

export default class DispatchContainer extends Control {
    protected _template: TemplateFunction = template;
    protected _beforeMount() {
        this._dispatcher = new Dispatcher({
            prefix: '_layout'
        });
    }
    protected _getChildContext = () => {
        return {
            dispatcher: this._dispatcher
        };
    }
}
