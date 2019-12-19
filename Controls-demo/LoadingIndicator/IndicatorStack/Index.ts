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
    private _overlayId = null;
    private _overlay(): void {
        const delay = 3000;
        let promise = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
        const cfg = {
            id: this._overlayId,
            message: 'Индикатор закроется через ' + delay / 1000,
            overlay: 'dark',
            delay: 0
        };
        this._overlayId = this._notify('showIndicator', [cfg, promise], {bubbling: true});
        this._interval(this._overlayId, delay);

    }

    private _interval(id, delay): void {
        let self = this;
        setTimeout(() => {
            if (delay > 1000) {
                delay -= 1000;
                let cfg = {
                    id: id,
                    overlay: 'dark',
                    message: 'Индикатор закроется через ' + delay / 1000,
                    delay: 0
                };
                self._overlayId = self._notify('showIndicator', [cfg], { bubbling: true });
                self._interval(self._overlayId, delay);
            }
            else {
                self._notify('hideIndicator', [this._overlayId], {bubbling: true});
            }
        }, 1000);
    }
}
export default IndicatorStack;
