import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/LoadingIndicatorPopup');
import 'css!Controls-demo/Controls-demo';
import {Dialog} from 'Controls/popup';

class LoadingIndicatorPopup extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];
    private _load(): void {
        let promise = new Promise((resolve) => {
            Dialog.openPopup({
                template: 'Controls-demo/LoadingIndicator/contentPopup/contentPopup',
                templateOptions: {
                    promiseResolve: resolve
                },
                opener: this._children.Button
            });
        });
        this._notify('showIndicator', [{
            overlay: 'dark',
            delay: 0,
            message: 'Пожалуйста, подождите'
        }, promise], {bubbling: true});
    }
}
export default LoadingIndicatorPopup;
