import {Model} from 'Types/entity';

const DEFAULT_EDITORS: object = {
    string: 'Controls/PropertyGrid/defaultEditors/String',
    boolean: 'Controls/PropertyGrid/defaultEditors/Boolean',
    date: 'Controls/PropertyGrid/defaultEditors/Date',
    number: 'Controls/PropertyGrid/defaultEditors/Number'
};

class PropertyGridItem extends Model {
    _moduleName: string = 'Controls/PropertyGrid/PropertyGridItem';

    _$idProperty: string = 'name';
    _$properties: object = {
        editorTemplateName: {
            get(value: string|void): string {
                return value || DEFAULT_EDITORS[this.get('type')] || DEFAULT_EDITORS[typeof this.get('propertyValue')];
            }
        },
        editorOptions: {
            get(value: Object): Object {
                const editorOptions: Object = {...value || {}};
                editorOptions.propertyValue = this.get('propertyValue');
                return editorOptions;
            }
        }
    };
}

export = PropertyGridItem;
