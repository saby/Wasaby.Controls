import {Control, TemplateFunction} from "UI/Base";
import * as Template from "wml!Controls-demo/toggle/RadioButtons/RadioButtons";
import {Record, Model} from 'Types/entity';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: Record[];
    protected _selectedKey: string = '1';

    protected _beforeMount(): void {
        this._items = [
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
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
