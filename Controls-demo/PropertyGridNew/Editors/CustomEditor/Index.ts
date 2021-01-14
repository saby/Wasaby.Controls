import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/CustomEditor/Index';
import {TimeInterval} from 'Types/entity';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _source: object[] = [
        {
            name: 'time',
            group: 'customEditors',
            caption: 'TimeInterval',
            editorTemplateName: 'Controls-demo/PropertyGridNew/Editors/CustomEditor/resources/Editor',
            editorOptions: {
                mask: 'HH:MM'
            }
        }
    ];
    protected _editingObject: object = {
        time: new TimeInterval()
    };

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
