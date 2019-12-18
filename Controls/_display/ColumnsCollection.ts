import Collection, {ItemsFactory} from './Collection';
import ColumnsCollectionItem from './ColumnsCollectionItem';

import {create, register} from 'Types/di';
import {IOptions as ICollectionItemOptions} from './ColumnsCollectionItem';

export default class ColumnsCollection<
    S,
    T extends ColumnsCollectionItem<S> = ColumnsCollectionItem<S>
    > extends Collection<S, T> {

    protected _getItemsFactory(): ItemsFactory<T> {
        return function CollectionItemsFactory(options?: ICollectionItemOptions<S>): T {
            options.column = this._getOptions().collection.getIndex(options.contents) % 2;
            options.owner = this;
            return create(this._itemModule, options);
        };
    }
}

Object.assign(ColumnsCollection.prototype, {
    '[Controls/_display/ColumnsCollection]': true,
    _moduleName: 'Controls/display:ColumnsCollection',
    _instancePrefix: 'columns-item-',
    _itemModule: 'Controls/display:ColumnsCollectionItem'
});

register('Controls/display:ColumnsCollection', ColumnsCollection, {instantiate: false});
