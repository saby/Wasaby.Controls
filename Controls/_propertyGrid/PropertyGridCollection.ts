import {Tree} from 'Controls/display';
import PropertyGridCollectionItem from 'Controls/_propertyGrid/PropertyGridCollectionItem';
import {Model} from 'Types/entity';
import {ItemsFactory} from 'Controls/_display/Collection';

export default class PropertyGridCollection<S, T extends PropertyGridCollectionItem<S> = PropertyGridCollectionItem<S>>
    extends Tree<S, T> {
    protected _$editingObject: Object | Model | Record<string, any>;

    setEditingObject(editingObject: Object | Model | Record<string, any>): void {
        this._$editingObject = editingObject;
        this._updateItemsEditingObject();
        this.nextVersion();
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?): T {
            options.editingObject = this._$editingObject;
            return superFactory.call(this, options);
        };
    }

    protected _updateItemsEditingObject(): void {
        this.getViewIterator().each((item: PropertyGridCollectionItem<T>) => {
            if (item['[Controls/_propertyGrid/PropertyGridCollectionItem]']) {
                item.setPropertyValue(this._$editingObject);
            }
        });
    }
}

Object.assign(PropertyGridCollection.prototype, {
    '[Controls/_propertyGrid/PropertyGridCollection]': true,
    _moduleName: 'Controls/propertyGrid:PropertyGridCollection',
    _itemModule: 'Controls/propertyGrid:PropertyGridCollectionItem',
    _$editingObject: null
});
