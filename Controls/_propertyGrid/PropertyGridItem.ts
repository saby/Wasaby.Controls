import {Model} from 'Types/entity';
import {Enum} from 'Types/collection';

import getType = require('Core/helpers/getType');

const DEFAULT_EDITORS: object = {
    string: 'Controls/_propertyGrid/defaultEditors/String',
    boolean: 'Controls/_propertyGrid/defaultEditors/Boolean',
    date: 'Controls/_propertyGrid/defaultEditors/Date',
    number: 'Controls/_propertyGrid/defaultEditors/Number',
    text: 'Controls/_propertyGrid/defaultEditors/Text',
    enum: 'Controls/_propertyGrid/defaultEditors/Enum'
};

class PropertyGridItem extends Model {
    _$idProperty: string = 'name';
    _$properties: object = {
        editorTemplateName: {
            get(value: string|void): string {
                if (value || DEFAULT_EDITORS[this.get('type')]) {
                    return value || DEFAULT_EDITORS[this.get('type')];
                }
                if (getType(this.get('propertyValue')) === 'object') {
                    if (this.get('propertyValue') instanceof Enum) {
                        return DEFAULT_EDITORS['enum'];
                    }
                }
                return DEFAULT_EDITORS[getType(this.get('propertyValue'))];
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

PropertyGridItem._moduleName = 'Controls/_propertyGrid/PropertyGridItem';
export = PropertyGridItem;
