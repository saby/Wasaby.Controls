import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Source/Index';
import { Model } from 'Types/entity';
import {default as IPropertyGridItem} from 'Controls/_propertyGrid/IProperty';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _source: object[];

    protected _beforeMount(): void {
        this._editingObject = {
            description: 'This is http://mysite.com',
            tileView: true,
            showBackgroundImage: true
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
                    parent: null,
                    'parent@': true
                },
                {
                    name: 'tileView',
                    caption: 'Список плиткой',
                    group: 'booleanGroup',
                    parent: null,
                    'parent@': true
                },
                {
                    name: 'showBackgroundImage',
                    caption: 'Показывать изображение',
                    group: 'background',
                    parent: 'booleanGroup',
                    'parent@': true
                }
            ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/Editors/HighlightOnHover/Index',
        'Controls-demo/PropertyGridNew/PropertyGrid'];
}
