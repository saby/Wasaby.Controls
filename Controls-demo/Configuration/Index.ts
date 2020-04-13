import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/Configuration/ListEditor';
import 'css!Controls-demo/Controls-demo';
import "wml!Controls/Configuration/ListEditor/ItemTemplate";

interface IListEditorOptions extends IControlOptions {
    selectedKey: string;
}

export default class ListEditorDemo extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: string = 'tile';
    protected _tileTemplate = {
        templateName: 'wml!Controls-demo/Configuration/tileTemplate',
        templateOptions: {
            name: 'tile'
        }
    };
    protected _tableTemplate = {
        templateName: 'wml!Controls-demo/Configuration/tableTemplate',
        templateOptions: {
            name: 'table'
        }
    };
    protected _listTemplate = {
        templateName: 'wml!Controls-demo/Configuration/listTemplate',
        templateOptions: {
            name: 'list'
        }
    };

    protected async _customizeClick(): Promise<string> {
        const popup = await import('Controls/popup');
        return popup.Stack.openPopup({
            template: 'Controls-demo/Configuration/CustomizePopup',
            width: 800
        });
    }
}
