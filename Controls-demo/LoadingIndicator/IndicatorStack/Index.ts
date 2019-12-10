import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/IndicatorStack/IndicatorStack');
import 'css!Controls-demo/Controls-demo';

class IndicatorStack extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];
    private _firstId = null;

    private _firstId = null;
    private _secondId = null;
    private _firstOpen(): void {
        const cfg = {
            id: this._firstId,
            message: 'Текст первого индикатора',
            overlay: 'none',
            delay: 0
        };
        this._firstId = this._notify('showIndicator', [cfg], { bubbling: true });
    }
    private _close(event, name): void {
        const indicatorName = '_' + name + 'Id';
        if (this[indicatorName]) {
            this._notify('hideIndicator', [this[indicatorName]], { bubbling: true });
            this[indicatorName] = null;
        }
    }
    private _secondOpen(): void {
        const cfg = {
            id: this._secondId,
            overlay: 'none',
            message: 'Текст второго индикатора',
            delay: 0
        };
        this._secondId = this._notify('showIndicator', [cfg], { bubbling: true });
    }
}
export default IndicatorStack;
