import {TreeItem} from 'Controls/display';
import PropertyGridCollection from './PropertyGridCollection';
import {DEFAULT_EDITORS} from './Constants';
import {Enum} from 'Types/collection';
import * as getType from 'Core/helpers/getType';

export default class PropertyGridCollectionItem<T> extends TreeItem<T> {
    protected _$owner: PropertyGridCollection<T>;
    protected _$keyProperty: string = 'name';

    getEditorTemplateName(): string {
        const itemContents = this.getContents();
        const editorTemplateName = itemContents.get('editorTemplateName');
        const type = itemContents.get('type');
        const propertyValue = itemContents.get('propertyValue');

        if (editorTemplateName || DEFAULT_EDITORS[type]) {
            return editorTemplateName || DEFAULT_EDITORS[type];
        }
        if (getType(propertyValue) === 'object') {
            if (propertyValue instanceof Enum) {
                return DEFAULT_EDITORS.enum;
            }
        }
        return DEFAULT_EDITORS[getType(propertyValue)];
    }

    getEditorOptions(): object {
        const itemContents = this.getContents();
        const editorOptions = itemContents.get('editorOptions') || {};
        editorOptions.propertyValue = itemContents.get('propertyValue');
        return editorOptions;
    }
}

Object.assign(PropertyGridCollectionItem.prototype, {
    '[Controls/_propertyGrid/PropertyGridCollectionItem]': true,
    _moduleName: 'Controls/propertyGrid:PropertyGridCollectionItem'
});
