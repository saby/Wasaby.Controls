import TileCollectionItem, { IOptions } from './TileCollectionItem';
import {Model} from 'Types/entity';
import { Collection, ItemsFactory } from 'Controls/display';
import Tile from 'Controls/_tileNew/display/mixins/Tile';
import { mixin } from 'Types/util';

export default class TileCollection<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> extends mixin<Collection<S, T>, Tile>(Collection, Tile) {
    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TileItemsFactory(options: IOptions<S>): T {
            const params = this._getItemsFactoryParams(options);
            return parent.call(this, params);
        };
    }
}

Object.assign(TileCollection.prototype, {
    '[Controls/_tileNew/TileCollection]': true,
    _moduleName: 'Controls/tileNew:TileCollection',
    _itemModule: 'Controls/tileNew:TileCollectionItem'
});
