import {Control, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/Layout/Area/Controller');
import {SyntheticEvent} from 'Vdom/Vdom';
import 'css!Controls-demo/Controls-demo';

export default class AreaController extends Control {
    protected _template: TemplateFunction = template;
    protected _selectedKey: unknown = null;

    protected _beforeMount(options): void {
        this._selectedKey = options.selectedKey;
    }

    protected _beforeUpdate(options): void {
        if (options.selectedKey !== this._options.selectedKey) {
            this._selectedKey = options.selectedKey;
        }
    }

    protected _areaKeyChanged(event: SyntheticEvent, key: unknown): void {
        event.stopImmediatePropagation();
        this._notify('selectedKeyChanged', [key]);
        this._selectedKey = key;
    }
}