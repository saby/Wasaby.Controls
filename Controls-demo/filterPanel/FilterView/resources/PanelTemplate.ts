import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterView/resources/PanelTemplate';
import * as stackTemplate from 'wml!Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate';
import {Memory} from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;
    protected _filterButtonData: unknown[] = [];
    protected _filterItems: object[] = null;

    protected _beforeMount(): void {
        this._filterItems = [
            { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
            { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
            { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
            { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
        ];
        this._filterButtonData = [
            {
                group: 'Количество сотрудников',
                name: 'amount',
                editorTemplateName: 'Controls/filterPanel:NumberRangeEditor',
                resetValue: [],
                caption: '',
                value: [],
                textValue: '',
                editorOptions: {
                    afterEditorTemplate: 'wml!Controls-demo/filterPanel/resources/AfterEditorTemplate',
                    minValueInputPlaceholder: '0',
                    maxValueInputPlaceholder: '1 000 000'
                }
            },
            {
                group: 'Ответственный',
                name: 'owner',
                resetValue: [],
                caption: '',
                value: [],
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    style: 'master',
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false
                        }
                    },
                    keyProperty: 'owner',
                    additionalTextProperty: 'id',
                    displayProperty: 'title',
                    selectorTemplate: {
                        templateName: 'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
                        templateOptions: {items: this._filterItems},
                        popupOptions: {
                            width: 500
                        }
                    },
                    source: new Memory({
                        data: this._filterItems,
                        keyProperty: 'owner'
                    })
                }
            }
        ];
    }

    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/Filter_new/Filter'];
}
