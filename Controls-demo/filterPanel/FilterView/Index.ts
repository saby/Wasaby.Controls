import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterView/Index';
import {isEqual} from 'Types/object';
import {Memory} from 'Types/source';
import {departments} from 'Controls-demo/filterPanel/resources/DataStorage';

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
                    owner: [],
                    amount: []
                };
                for (const filterField in queryFilter) {
                    if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        addToData = (itemValue >= filterValue[0] && itemValue <= filterValue[1]) || filterValue.includes(itemValue);

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
                editorTemplateName: 'Controls/filterPanel:NumberRangeEditor',
                resetValue: [],
                caption: '',
                value: [],
                textValue: ''
            },
            {
                group: 'Ответственный',
                name: 'owner',
                resetValue: [],
                caption: '',
                value: [],
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor'
            }
        ];
    }

    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/Filter_new/Filter'];
}
