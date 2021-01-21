import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Source/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _source: object[];

    protected _beforeMount(): void {
        this._editingObject = {
            description: 'This is http://mysite.com',
            tileView: true,
            showBackgroundImage: true,
            showVideo: true
        };

        this._source = [
            {
                name: 'description',
                editorOptions: {
                    minLines: 3
                },
                editorClass: 'controls-demo-pg-text-editor',
                group: 'text',
                type: 'text',
                '@parent': true,
                parent: null
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                group: 'booleanGroup',
                '@parent': true,
                parent: null
            },
            {
                name: 'showVideo',
                caption: 'Показывать видео',
                '@parent': null,
                parent: 'tileView'
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                '@parent': null,
                parent: 'description'
            }
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/Editors/HighlightOnHover/Index',
        'Controls-demo/PropertyGridNew/PropertyGrid'];
}
