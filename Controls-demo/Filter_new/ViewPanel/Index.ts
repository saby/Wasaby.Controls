import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/ViewPanel/Index';
import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import {Memory} from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;
    protected _navigation: object = null;

    protected _beforeMount(): void {
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 20,
                page: 0,
                hasMore: false
            }
        };
        this._source = new Memory({
            data: MemorySourceData.departments,
            keyProperty: 'id',
            filter: MemorySourceFilter({
                owner: '0',
                department: '1'
            })
        });
        this._filterButtonData = [
            {
                group: 'Количество сотрудников',
                name: 'amount',
                itemTemplate: 'Controls/filter:NumberRangeEditor',
                editorTemplateName: 'Controls/filter:NumberRangeEditor',
                resetValue: [0, 6],
                value: [0, 15],
                type: 'text'
            },
            {
                group: 'Ответственный',
                name: 'owner',
                resetValue: '0',
                value: '0',
                editorTemplateName: 'Controls/filter:ListEditor',
                textValue: '',
                editorOptions: {
                    keyProperty: 'owner',
                    displayProperty: 'title',
                    source: new Memory({
                        data: [
                            { id: 0, title: 'По ответственному', owner: '0' },
                            { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
                            { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
                            { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
                            { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
                        ],
                        keyProperty: 'owner'
                    })
                }
            }
        ];
    }

    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/Filter_new/Filter'];
}
