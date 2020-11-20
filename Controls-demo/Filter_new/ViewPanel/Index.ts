import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/ViewPanel/Index';
import {isEqual} from 'Types/object';
import {Memory} from 'Types/source';
import {departments} from 'Controls-demo/Filter_new/resources/DataStorage';

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
            data: departments,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                let addToData = true;
                const emptyFields = {
                    owner: 'По ответственному',
                    amount: 1
                };
                for (const filterField in queryFilter) {
                    if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);

                        if (typeof itemValue === 'string') {
                            addToData = itemValue === filterValue;
                        }
                        if (Array.isArray(filterValue)) {
                            addToData = itemValue >= filterValue[0] && itemValue <= filterValue[1];
                        }

                        if (emptyFields && isEqual(filterValue, emptyFields[filterField])) {
                            addToData = true;
                        }
                    }
                }
                return addToData;
            }
        });
        this._filterButtonData = [
            {
                group: 'Количество сотрудников',
                name: 'amount',
                itemTemplate: 'Controls/filter:NumberRangeEditor',
                editorTemplateName: 'Controls/filter:NumberRangeEditor',
                resetValue: [0, 150],
                value: [0, 15],
                editorOptions: {
                    afterEditorTemplate: 'wml!Controls-demo/Filter_new/resources/Editors/AfterEditorTemplate'
                }
            },
            {
                group: 'Ответственный',
                name: 'owner',
                resetValue: 'По ответственному',
                value: 'По ответственному',
                editorTemplateName: 'Controls/filter:ListEditor',
                editorOptions: {
                    keyProperty: 'owner',
                    columns: [{displayProperty: 'title', width: 'auto'}, {align: 'right', displayProperty: 'id'}],
                    displayProperty: 'title',
                    source: new Memory({
                        data: [
                            { id: 0, title: 'По ответственному', owner: 'По ответственному' },
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
