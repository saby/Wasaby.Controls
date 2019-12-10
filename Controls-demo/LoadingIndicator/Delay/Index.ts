import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/Delay/Delay');
import 'css!Controls-demo/Controls-demo';

class Delay extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];
    private _firstId = null;
    private _secondId = null;

    private _close(event, name): void {
        const indicatorName = '_' + name + 'Id';
        if (this[indicatorName]) {
            this._notify('hideIndicator', [this[indicatorName]], { bubbling: true });
            this[indicatorName] = null;
        }
    }
    private _firstOpen(): void {
        const cfg = {
            id: this._firstId,
            overlay: 'none',
            message: 'Текст индикатора'
        };
        this._firstId = this._notify('showIndicator', [cfg], { bubbling: true });
    }
    private _secondOpen(): void {
        const cfg = {
            id: this._secondId,
            overlay: 'none',
            message: 'Текст индикатора',
            delay: 0
        };
        this._secondId = this._notify('showIndicator', [cfg], { bubbling: true });
    }
}
export default Delay;
