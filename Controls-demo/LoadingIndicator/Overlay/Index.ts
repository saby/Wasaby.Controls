import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/Overlay/Overlay');
import 'css!Controls-demo/Controls-demo';

class Overlay extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];
    private _firstId = null;

    private _firstId = null;
    private _secondId = null;
    private _thirdId = null;
    private _firstOpen(): void {
        const cfg = {
            id: this._firstId,
            message: 'Закроется через 3 секунды',
            delay: 0
        };
        this._firstId = this._notify('showIndicator', [cfg], { bubbling: true });
        setTimeout(() => {
            this._notify('hideIndicator', [this._firstId], { bubbling: true });
        }, 3000);
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
            overlay: 'dark',
            message: 'Закроется через 3 секунды',
            delay: 0
        };
        this._secondId = this._notify('showIndicator', [cfg], { bubbling: true });
        setTimeout(() => {
            this._notify('hideIndicator', [this._secondId], { bubbling: true });
        }, 3000);
    }
    private _thirdOpen(): void {
        const cfg = {
            id: this._thirdId,
            overlay: 'none',
            message: 'Закроется при нажатии на кнопку close',
            delay: 0
        };
        this._thirdId = this._notify('showIndicator', [cfg], { bubbling: true });
        setTimeout(() => {
            this._notify('hideIndicator', [this._thirdId], { bubbling: true });
        }, 3000);
    }
}
export default Overlay;
