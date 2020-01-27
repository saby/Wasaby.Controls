import CollectionItem from './CollectionItem';
import GridCollection from './GridCollection';
import { register } from 'Types/di';

export default class GridCollectionItem<T> extends CollectionItem<T> {
    protected _$owner: GridCollection<T>;
}

Object.assign(GridCollectionItem.prototype, {
    '[Controls/_display/GridCollectionItem]': true,
    _moduleName: 'Controls/display:GridCollectionItem',
    _instancePrefix: 'grid-item-'
});

register('Controls/display:GridCollectionItem', GridCollectionItem, {instantiate: false});
