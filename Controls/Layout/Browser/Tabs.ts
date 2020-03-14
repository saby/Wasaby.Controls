import {IControlOptions, Control, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import template = require('wml!Controls/Layout/Browser/Tabs/Tabs');
import {SyntheticEvent} from 'Vdom/Vdom';
import 'css!Controls/Layout/Browser/Browser';

export default class Tabs extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _selectedKeyChanged(event: SyntheticEvent<Event>, key: unknown): void {
        this._notify('selectedKeyChanged', [key]);
    }

    static getDefaultOptions = () => {
        return {
            items: [],
            selectedKey: ''
        };
    }
}