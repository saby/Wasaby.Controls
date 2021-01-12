import {Control, TemplateFunction} from 'UI/Base';
// @ts-ignore
import * as Template from 'wml!Controls-demo/toggle/ButtonGroup/SmallButtonGroup/Index';
import {RecordSet} from 'Types/collection';

export default class extends Control {
    static _styles: string[] = ['Controls-demo/Controls-demo'];
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKey: string = '3';

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: '1'
                },
                {
                    id: '2',
                    caption: '2'
                },
                {
                    id: '3',
                    caption: '3'
                },
                {
                    id: '4',
                    caption: '4'
                },
                {
                    id: '5',
                    caption: '5'
                }
            ],
            keyProperty: 'id'
        });
    }
}
