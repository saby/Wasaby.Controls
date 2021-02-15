import {Collection as BaseCollection, ItemsFactory, IDragPosition} from 'Controls/display';
import CollectionItem, {IOptions as ICollectionItemOptions} from './CollectionItem';
import ColumnsDragStrategy from './itemsStrategy/ColumnsDrag';

export default class Collection<
    S,
    T extends CollectionItem<S> = CollectionItem<S>
> extends BaseCollection<S, T> {
    protected _$columnProperty: string;
    protected _dragStrategy: Function = ColumnsDragStrategy;

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: ICollectionItemOptions<S>): T {
            options.columnProperty = this._$columnProperty;
            options.owner = this;
            return superFactory.call(this, options);
        };
    }
    getColumnProperty(): string {
        return this._$columnProperty;
    }

    setDragPosition(position: IDragPosition<T>): void {
        if (position) {
            const strategy = this.getStrategyInstance(this._dragStrategy) as ColumnsDragStrategy<unknown>;
            const avatarItem = strategy.avatarItem;
            if (avatarItem.getColumn() !== position.dispItem.getColumn()) {
                strategy.avatarItem.setColumn(position.dispItem.getColumn());
            }
        }
        super.setDragPosition(position);
    }
}

Object.assign(Collection.prototype, {
    '[Controls/_columns/display/Collection]': true,
    _moduleName: 'Controls/columns:ColumnsCollection',
    _itemModule: 'Controls/columns:ColumnsCollectionItem'
});
