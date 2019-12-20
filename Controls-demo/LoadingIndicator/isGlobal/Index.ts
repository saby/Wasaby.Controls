import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/isGlobal/IsGlobal');
import 'css!Controls-demo/Controls-demo';

class IsGlobal extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];
    private _firstId = null;

    private _firstOpen(): void {
        const cfg = {
            id: this._firstId,
            message: 'first indicator text',
            overlay: 'none'
        };
        this._firstId = this._notify('showIndicator', [cfg], {bubbling: true});
        setTimeout(() => {
            this._notify('hideIndicator', [this._firstId], { bubbling: true });
        }, 5000);
    }
}
export default IsGlobal;
