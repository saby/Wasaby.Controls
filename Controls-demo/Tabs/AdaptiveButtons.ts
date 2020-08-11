import {Control, TemplateFunction} from 'UI/Base';
import {RecordSet} from 'Types/collection';
import template = require('wml!Controls-demo/Tabs/AdaptiveButtons/AdaptiveButtons');

export default class TabButtonsDemo extends Control {
    protected _template: TemplateFunction = template;
    protected SelectedKey1: string = '1';
    protected _items: RecordSet | null = null;
    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Files'
                },
                {
                    id: '2',
                    title: 'Files'
                },
                {
                    id: '3',
                    title: 'Files'
                },
                {
                    id: '4',
                    title: 'Files'
                },
                {
                    id: '5',
                    title: 'Files'
                },
                {
                    id: '6',
                    title: 'Files'
                },
                {
                    id: '7',
                    title: 'Files'
                },
                {
                    id: '8',
                    title: 'Files'
                },
                {
                    id: '9',
                    title: 'Files'
                },
                {
                    id: '10',
                    title: 'Files'
                },
                {
                    id: '11',
                    title: 'Files'
                },
                {
                    id: '12',
                    title: 'Files'
                },
                {
                    id: '13',
                    title: 'Files'
                }
            ]
        });
    }

    static _styles: string[] = ['Controls-demo/Tabs/Buttons/Buttons'];
}
