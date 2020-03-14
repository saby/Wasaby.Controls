import {IControlOptions, Control, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import template = require('wml!Controls/Layout/Browser/Browser');
import 'css!Controls/Layout/Browser/Browser';
import {SyntheticEvent} from 'Vdom/Vdom';

export default class Browser extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _tabsSource: Memory = null;
    protected _currentTab: string = '1';

    protected _beforeMount(options: IControlOptions): void {
        this._currentTab = '1';
        this._tabsSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '1',
                    title: 'Document'
                },
                {
                    id: '2',
                    title: 'Files'
                },
                {
                    id: '3',
                    title: 'Orders'
                }
            ]
        });
    }

    protected _tabKeyChanged(event: SyntheticEvent<Event>, key: string): void {
        this._notify('areaKeyChanged', [key], {bubbling: true});
    }

    static getDefaultOptions = (): object => {
        return {
            filterSource: [],
            filter: {},
            searchStartingWith: 3
        };
    }
}
