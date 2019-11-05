import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_validate/RedFrame');

class RedFrame extends Control<IControlOptions>{
    protected _template: TemplateFunction = template;
    protected _activeState: Boolean = false;
    private _activateHandler(e): void {
        this._activeState = true;
    }
    private _deactivateHandler(e): void {
        this._activeState = false;
    }
    static _theme: string[] = ['Controls/validate'];
}

export default RedFrame;

