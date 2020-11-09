import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Combobox/OneItem/Index';
import {Memory} from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;
    protected _selectedKey: number;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {key: 1, title: 'Ярославль'}
            ]
        });
        this._selectedKey = 1;
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
