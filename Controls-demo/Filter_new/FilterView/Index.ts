import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/FilterView';
import 'css!Controls-demo/Controls-demo';
import {Memory} from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory = null;
    protected _currentTab: string = '1';

    protected _beforeMount(): void {
        this._source = new Memory({
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
}
