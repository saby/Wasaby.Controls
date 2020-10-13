import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/ContentTemplate/Index');
import {Memory} from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedKeys: number[] = [1];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                { id: 1, title: 'Name', icon: 'icon-TrendUp' },
                { id: 2, title: 'Date of change', icon: 'icon-TrendDown' }
            ]
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
