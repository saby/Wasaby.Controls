import {Control, TemplateFunction} from 'UI/Base';
import * as template from "wml!Controls-demo/Async/AsyncFrendly";

export default class extends Control {
    _template: TemplateFunction = template;
    errorViewConfig: unknown;
    errorCallback = (viewConfig: unknown): void => {
        this.errorViewConfig = viewConfig;
    }
}
