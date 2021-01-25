import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyHeader/Enabled/Template');

export default class MultiHeaderDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _enabled: boolean = false;

    protected _updateEnabled(): void {
        this._enabled = !this._enabled;
    }

    static _theme: string[] = ['Controls/Classes'];

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
