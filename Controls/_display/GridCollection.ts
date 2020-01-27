import Collection from './Collection';
import { register } from 'Types/di';
import GridCollectionItem from './GridCollectionItem';

export default class GridCollection<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends Collection<S, T> { }

Object.assign(GridCollection.prototype, {
    '[Controls/_display/GridCollection]': true,
    _moduleName: 'Controls/display:GridCollection',
    _itemModule: 'Controls/display:GridCollectionItem'
});

register('Controls/display:GridCollection', GridCollection, {instantiate: false});
