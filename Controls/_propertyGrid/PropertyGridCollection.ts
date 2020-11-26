import {Tree} from 'Controls/display';
import PropertyGridCollectionItem from 'Controls/_propertyGrid/PropertyGridCollectionItem';

export default class PropertyGridCollection<S, T extends PropertyGridCollectionItem<S> = PropertyGridCollectionItem<S>>
    extends Tree<S, T> {}

Object.assign(PropertyGridCollection.prototype, {
    '[Controls/_propertyGrid/PropertyGridCollection]': true,
    _moduleName: 'Controls/propertyGrid:PropertyGridCollection',
    _itemModule: 'Controls/propertyGrid:PropertyGridCollectionItem'
});
