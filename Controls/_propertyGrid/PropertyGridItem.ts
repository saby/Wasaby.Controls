import {Model} from 'Types/entity';

const DEFAULT_EDITORS: object = {
    string: 'Controls/_propertyGrid/defaultEditors/String',
    boolean: 'Controls/_propertyGrid/defaultEditors/Boolean',
    date: 'Controls/_propertyGrid/defaultEditors/Date',
    number: 'Controls/_propertyGrid/defaultEditors/Number'
};

class PropertyGridItem extends Model {
    _moduleName: string = 'Controls/_propertyGrid/PropertyGridItem';

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
