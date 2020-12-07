import {Control, TemplateFunction} from 'UI/Base';
import {RecordSet} from 'Types/collection';
import {data} from '../tabsItems';
import template = require('wml!Controls-demo/Tabs/Buttons/SeparatorVisible/SeparatorVisible');
import {StackOpener} from "Controls/popup";

export default class TabButtonsDemo extends Control {
    protected _template: TemplateFunction = template;

    protected SelectedKey1: string = '1';
    protected SelectedKey2: string =  '1';
    protected _items1: RecordSet | null = null;

    protected _beforeMount(): void {
        this._items1 = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItems()
        });
    }

    protected _openTabsPanel(): void {
        return new StackOpener().open({
            template: 'Controls-demo/Tabs/Buttons/Panel',
            opener: this,
            width: 900
        });
    }

    static _styles: string[] = ['Controls-demo/Tabs/Buttons/Buttons', 'Controls-demo/Controls-demo'];
}
