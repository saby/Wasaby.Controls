import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Stack/RestrictiveContainer/Index');
import {StackOpener} from 'Controls/popup';

const baseStackConfig = {
    template: 'Controls-demo/Popup/TestStack',
    closeOnOutsideClick: true,
    autofocus: true,
    opener: null
};

class RestrictiveContainer extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Popup/Stack/RestrictiveContainer/Index', 'Controls-demo/Controls-demo'];
    private _stackOpener: StackOpener;

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._stackOpener = new StackOpener();
    }

    protected _openStackHandler(event: Event, isInsideRestrictive: boolean): void {
        this._stackOpener.open(baseStackConfig);
    }

    protected _openRestrictiveStackHandler(): void {
        const config = {...baseStackConfig, ...{restrictiveContainer: '.ControlsDemo-Popup-Stack__globalContainer'}};
        this._stackOpener.open(config);
    }
}
export default RestrictiveContainer;
