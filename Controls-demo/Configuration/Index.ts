import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/Configuration/ListEditor';
import 'css!Controls-demo/Controls-demo';
import {getEditingObject, getSource} from 'Controls-demo/PropertyGridNew/resources/Data';

interface IListEditorOptions extends IControlOptions {
    selectedKey: string;
}

export default class ListEditorDemo extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: string = 'tile';
    protected _items = [
        {
            name: 'tile',
            caption: 'Плитка',
            icon: 'ArrangePreview',
            templateName: 'wml!Controls-demo/Configuration/TabTemplate',
            templateOptions: {
                name: 'tile',
                editorValue: getEditingObject(),
                editorSource: getSource()
            }
        },
        {
            name: 'tree',
            caption: 'Таблица',
            icon: 'TableCreate',
            templateName: 'wml!Controls-demo/Configuration/TabTemplate',
            templateOptions: {
                name: 'tree',
                editorValue: getEditingObject(),
                editorSource: getSource()
            }
        },
        {
            name: 'list',
            caption: 'Список',
            icon: 'InputHistory',
            templateName: 'wml!Controls-demo/Configuration/TabTemplate',
            templateOptions: {
                name: 'list',
                editorValue: getEditingObject(),
                editorSource: getSource()
            }
        }
    ];

    protected async _customizeClick(): Promise<string> {
        const popup = await import('Controls/popup');
        return popup.Stack.openPopup({
            template: 'Controls-demo/Configuration/CustomizePopup',
            width: 800
        });
    }
}
