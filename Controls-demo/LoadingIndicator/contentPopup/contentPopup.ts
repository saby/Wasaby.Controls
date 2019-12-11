import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/contentPopup/contentPopup');
import * as myModule from 'Controls/LoadingIndicator';

class contentPopup extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];

    protected _beforeMount() {
        const delay: number = 5000;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }

    protected _afterMount(): void {
        this._options.promiseResolve();
    }
}
export default contentPopup;
