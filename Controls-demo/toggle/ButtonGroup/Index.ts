import {Control, TemplateFunction} from 'UI/Base';
// @ts-ignore
import * as Template from 'wml!Controls-demo/toggle/ButtonGroup/ButtonGroup';
import {Record, Model} from 'Types/entity';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items1: Record[];
    protected _items2: Record[];
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '5';

    protected _beforeMount(): void {
        this._items1 = [
            {
                id: '1',
                caption: 'Название 1'
            },
            {
                id: '2',
                caption: 'Название 2'
            }
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id'
            });
        });
        this._items2 = [
            {
                id: '1',
                caption: 'Название 1'
            },
            {
                id: '2',
                caption: 'Название 2'
            },
            {
                id: '3',
                caption: 'Название 3'
            },
            {
                id: '4',
                caption: 'Название 4'
            },
            {
                id: '5',
                caption: 'Название 5'
            }
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id'
            });
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
